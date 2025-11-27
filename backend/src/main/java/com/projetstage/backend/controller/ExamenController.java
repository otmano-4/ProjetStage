package com.projetstage.backend.controller;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Examen;
import com.projetstage.backend.model.Utilisateur;
import com.projetstage.backend.repository.ClasseRepository;
import com.projetstage.backend.repository.ExamenRepository;
import com.projetstage.backend.repository.UtilisateurRepository;
import com.projetstage.backend.dto.ExamenDTO;
import com.projetstage.backend.dto.ExamenDetailsDTO;
import com.projetstage.backend.dto.QuestionDTO;
import com.projetstage.backend.dto.CreateExamenRequest;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;

import com.projetstage.backend.model.Question;

@RestController
@RequestMapping("/api/examens")
@CrossOrigin(origins = "*")
public class ExamenController {

    private final ExamenRepository examenRepository;
    private final ClasseRepository classRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ExamenController(ExamenRepository examenRepository, ClasseRepository classRepository, UtilisateurRepository utilisateurRepository) {
        this.examenRepository = examenRepository;
        this.classRepository = classRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping
    public List<ExamenDTO> getAll() {
        return examenRepository.findAll()
                .stream()
                .map(ExamenDTO::new)
                .toList();
    }

    @GetMapping("/afficher")
    public List<ExamenDTO> getAfficherExams() {
        return examenRepository.findByAfficherTrue()
                .stream()
                .map(ExamenDTO::new)
                .toList();
    }


    @GetMapping("/classe/{classeId}")
    public List<ExamenDTO> getByClasse(@PathVariable Long classeId) {
        return examenRepository.findByClasseId(classeId)
                .stream()
                .map(ExamenDTO::new)
                .toList();
    }

    @PostMapping
    public ExamenDetailsDTO create(@RequestBody CreateExamenRequest request) {
        Utilisateur professeur = utilisateurRepository.findById(request.getProfesseurId())
            .orElseThrow(() -> new RuntimeException("Professeur not found"));

        Classe classe = classRepository.findById(request.getClasseId())
            .orElseThrow(() -> new RuntimeException("Classe not found"));

        Examen examen = new Examen();
        examen.setTitre(request.getTitre());
        examen.setDescription(request.getDescription());
        examen.setDuree(request.getDuree());
        examen.setAfficher(request.isAfficher());
        examen.setDatePublication(LocalDateTime.now());
        examen.setProfesseur(professeur);
        examen.setClasse(classe);

        // Add questions
        if (request.getQuestions() != null) {
            request.getQuestions().forEach(qReq -> {
                Question q = new Question();
                q.setType(Question.Type.valueOf(qReq.getType()));
                q.setContenu(qReq.getContenu());
                q.setOptions(qReq.getOptions());
                q.setReponseCorrecte(qReq.getReponseCorrecte());
                examen.addQuestion(q);
            });
        }

        Examen saved = examenRepository.save(examen);

        // Convert questions to DTO
        List<QuestionDTO> questionDTOs = saved.getQuestions()
            .stream()
            .map(QuestionDTO::new)
            .toList();

        return new ExamenDetailsDTO(saved.getId(), saved.getTitre(), saved.getDescription(),
            saved.getDuree(), saved.isAfficher(), saved.getDatePublication(),
            saved.getProfesseur().getNom(), questionDTOs);
    }


    // ✅ Supprimer un examen
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        examenRepository.deleteById(id);
    }


   @GetMapping("/{id}")
    public ExamenDetailsDTO getById(@PathVariable Long id) {
        Examen examen = examenRepository.findWithQuestionsAndProfesseurById(id);
        if (examen == null) throw new RuntimeException("Examen not found");

        List<QuestionDTO> questionDTOs = examen.getQuestions()
            .stream()
            .map(QuestionDTO::new)
            .toList();

        return new ExamenDetailsDTO(
            examen.getId(),
            examen.getTitre(),
            examen.getDescription(),
            examen.getDuree(),
            examen.isAfficher(),
            examen.getDatePublication(),
            examen.getProfesseur().getNom(),
            questionDTOs
        );
    }

    @PostMapping("/{examId}/questions")
public QuestionDTO addQuestionToExam(
        @PathVariable Long examId,
        @RequestBody QuestionDTO questionDTO) {

    Examen examen = examenRepository.findById(examId)
            .orElseThrow(() -> new RuntimeException("Exam not found"));

    Question q = new Question();
    q.setType(Question.Type.valueOf(questionDTO.getType()));
    q.setContenu(questionDTO.getContenu());
    q.setOptions(questionDTO.getOptions());
    q.setReponseCorrecte(questionDTO.getReponseCorrecte());

    examen.addQuestion(q);
    examenRepository.save(examen);

    return new QuestionDTO(q);
}


}


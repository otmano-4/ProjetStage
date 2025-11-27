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
import com.projetstage.backend.dto.ClasseDTO;
import com.projetstage.backend.dto.CreateExamenRequest;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;

import com.projetstage.backend.dto.CreateQuestionRequestDTO;
import com.projetstage.backend.dto.ExamenDetailsQuestionsDTO;
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

        Examen saved = examenRepository.save(examen);

        return new ExamenDetailsDTO(saved.getId(), saved.getTitre(), saved.getDescription(),
            saved.getDuree(), saved.isAfficher(), saved.getDatePublication(),
            saved.getProfesseur().getNom());
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        examenRepository.deleteById(id);
    }


    @GetMapping("/{id}")
    public ExamenDTO getById(@PathVariable Long id) {
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen non trouvée"));

        return new ExamenDTO(examen);
    }

    @GetMapping("/{id}/details")
public ExamenDetailsQuestionsDTO getExamWithQuestions(@PathVariable Long id) {

    Examen examen = examenRepository.findByIdWithQuestions(id)
            .orElseThrow(() -> new RuntimeException("Examen not found"));

    List<QuestionDTO> q = examen.getQuestions()
                                .stream()
                                .map(QuestionDTO::new)
                                .toList();

    return new ExamenDetailsQuestionsDTO(examen, q);
}


    @PostMapping("/{examId}/questions")
public QuestionDTO addQuestion(
        @PathVariable Long examId,
        @RequestBody CreateQuestionRequestDTO req
) {
    Examen examen = examenRepository.findById(examId)
            .orElseThrow(() -> new RuntimeException("Examen not found"));

    Question q = new Question();
    q.setTitre(req.getTitre());
    q.setType(Question.Type.valueOf(req.getType())); // must match enum
    q.setChoix(req.getChoix());
    q.setCorrect(req.getCorrect());

    examen.addQuestion(q);
    examenRepository.save(examen); // cascades question

    return new QuestionDTO(q);
}

}


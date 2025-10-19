package com.projetstage.backend.controller;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Examen;
import com.projetstage.backend.model.Utilisateur;
import com.projetstage.backend.repository.ClasseRepository;
import com.projetstage.backend.repository.ExamenRepository;
import com.projetstage.backend.repository.UtilisateurRepository;
import com.projetstage.backend.dto.ExamenDTO;
import com.projetstage.backend.dto.CreateExamenRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

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

    // ✅ Lister tous les examens
    @GetMapping
    public List<ExamenDTO> getAll() {
        return examenRepository.findAll()
                .stream()
                .map(ExamenDTO::new)
                .toList();
    }

    // ✅ Lister tous les examens à afficher
    @GetMapping("/afficher")
    public List<ExamenDTO> getAfficherExams() {
        return examenRepository.findByAfficherTrue()
                .stream()
                .map(ExamenDTO::new)
                .toList();
    }


    // ✅ Lister les examens d'une classe
    @GetMapping("/classe/{classeId}")
    public List<ExamenDTO> getByClasse(@PathVariable Long classeId) {
        return examenRepository.findByClasseId(classeId)
                .stream()
                .map(ExamenDTO::new)
                .toList();
    }

    // ✅ Créer un examen
    @PostMapping
    public ExamenDTO create(@RequestBody CreateExamenRequest request) {
        // 1️⃣ Fetch professor
        Utilisateur professeur = utilisateurRepository.findById(request.getProfesseurId())
            .orElseThrow(() -> new RuntimeException("Professeur not found"));

        // 2️⃣ Fetch class
        Classe classe = classRepository.findById(request.getClasseId())
            .orElseThrow(() -> new RuntimeException("Classe not found"));

        // 3️⃣ Map request to entity
        Examen examen = new Examen();
        examen.setTitre(request.getTitre());
        examen.setDescription(request.getDescription());
        examen.setDuree(request.getDuree());
        examen.setAfficher(request.isAfficher());
        examen.setDatePublication(LocalDateTime.now()); // current timestamp
        examen.setProfesseur(professeur);
        examen.setClasse(classe);

        // 4️⃣ Save
        Examen savedExamen = examenRepository.save(examen);

        // 5️⃣ Return DTO
        return new ExamenDTO(savedExamen);
    }

    // ✅ Supprimer un examen
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        examenRepository.deleteById(id);
    }
}

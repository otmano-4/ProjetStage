package com.projetstage.backend.controller;

import com.projetstage.backend.model.Examen;
import com.projetstage.backend.repository.ExamenRepository;
import com.projetstage.backend.dto.ExamenDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/examens")
@CrossOrigin(origins = "*")
public class ExamenController {

    private final ExamenRepository examenRepository;

    public ExamenController(ExamenRepository examenRepository) {
        this.examenRepository = examenRepository;
    }

    // ✅ Lister tous les examens
    @GetMapping
    public List<ExamenDTO> getAll() {
        return examenRepository.findAll()
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
    public ExamenDTO create(@RequestBody Examen examen) {
        Examen saved = examenRepository.save(examen);
        return new ExamenDTO(saved);
    }

    // ✅ Supprimer un examen
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        examenRepository.deleteById(id);
    }
}

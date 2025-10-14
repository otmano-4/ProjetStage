package com.projetstage.backend.controller;
import com.projetstage.backend.repository.ResultatRepository;
import com.projetstage.backend.dto.ResultatDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resultats")
@CrossOrigin(origins = "*")
public class ResultatController {

    private final ResultatRepository resultatRepository;

    public ResultatController(ResultatRepository resultatRepository) {
        this.resultatRepository = resultatRepository;
    }

    @GetMapping
    public List<ResultatDTO> getAll() {
        return resultatRepository.findAll()
                .stream()
                .map(ResultatDTO::new)
                .toList();
    }

    @GetMapping("/etudiant/{id}")
    public List<ResultatDTO> getByEtudiant(@PathVariable Long id) {
        return resultatRepository.findAll()
                .stream()
                .filter(r -> r.getEtudiant().getId().equals(id))
                .map(ResultatDTO::new)
                .toList();
    }

    @GetMapping("/examen/{id}")
    public List<ResultatDTO> getByExamen(@PathVariable Long id) {
        return resultatRepository.findAll()
                .stream()
                .filter(r -> r.getExamen().getId().equals(id))
                .map(ResultatDTO::new)
                .toList();
    }
}

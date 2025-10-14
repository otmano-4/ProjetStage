package com.projetstage.backend.controller;

import com.projetstage.backend.model.Reponse;
import com.projetstage.backend.repository.ReponseRepository;
import com.projetstage.backend.dto.ReponseDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reponses")
@CrossOrigin(origins = "*")
public class ReponseController {

    private final ReponseRepository reponseRepository;

    public ReponseController(ReponseRepository reponseRepository) {
        this.reponseRepository = reponseRepository;
    }

    @PostMapping
    public ReponseDTO create(@RequestBody Reponse reponse) {
        Reponse saved = reponseRepository.save(reponse);
        return new ReponseDTO(saved);
    }

    @GetMapping
    public List<ReponseDTO> getAll() {
        return reponseRepository.findAll()
                .stream()
                .map(ReponseDTO::new)
                .toList();
    }

    @PutMapping("/{id}")
    public ReponseDTO update(@PathVariable Long id, @RequestBody Reponse newData) {
        Reponse updated = reponseRepository.findById(id)
                .map(r -> {
                    r.setContenu(newData.getContenu());
                    r.setDateSoumission(newData.getDateSoumission());
                    r.setQuestion(newData.getQuestion());
                    r.setEtudiant(newData.getEtudiant());
                    return reponseRepository.save(r);
                })
                .orElseThrow();
        return new ReponseDTO(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        reponseRepository.deleteById(id);
    }
}

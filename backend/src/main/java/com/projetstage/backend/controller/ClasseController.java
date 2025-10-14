package com.projetstage.backend.controller;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.repository.ClasseRepository;
import com.projetstage.backend.dto.ClasseDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "*")
public class ClasseController {

    private final ClasseRepository classeRepository;

    public ClasseController(ClasseRepository classeRepository) {
        this.classeRepository = classeRepository;
    }

    // ✅ Liste des classes
    @GetMapping
    public List<ClasseDTO> getAll() {
        return classeRepository.findAll()
                .stream()
                .map(ClasseDTO::new)
                .toList();
    }

    // ✅ Créer une classe
    @PostMapping
    public ClasseDTO create(@RequestBody Classe classe) {
        Classe saved = classeRepository.save(classe);
        return new ClasseDTO(saved);
    }

    // ✅ Supprimer une classe
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        classeRepository.deleteById(id);
    }
}

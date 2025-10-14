package com.projetstage.backend.dto;

import com.projetstage.backend.model.Classe;
import java.util.List;
import java.util.stream.Collectors;

public class ClasseDTO {
    private Long id;
    private String nom;
    private List<String> etudiants; // juste les noms des étudiants

    public ClasseDTO(Classe c) {
        this.id = c.getId();
        this.nom = c.getNom();
        if (c.getEtudiants() != null)
            this.etudiants = c.getEtudiants().stream()
                .map(e -> e.getNom())
                .collect(Collectors.toList());
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public List<String> getEtudiants() { return etudiants; }
}

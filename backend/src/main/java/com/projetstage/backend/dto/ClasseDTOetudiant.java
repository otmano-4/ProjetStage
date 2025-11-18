package com.projetstage.backend.dto;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Utilisateur;

import java.util.List;
import java.util.stream.Collectors;

public class ClasseDTOetudiant {
    private Long id;
    private String nom;

    public ClasseDTOetudiant(Classe c) {
        this.id = c.getId();
        this.nom = c.getNom();
        
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }

    // Nested DTO for students to avoid exposing password etc.
    public static class EtudiantDTO {
        private Long id;
        private String nom;
        private String email;

        public EtudiantDTO(Utilisateur u) {
            this.id = u.getId();
            this.nom = u.getNom();
            this.email = u.getEmail();
        }

        public Long getId() { return id; }
        public String getNom() { return nom; }
        public String getEmail() { return email; }
    }
}

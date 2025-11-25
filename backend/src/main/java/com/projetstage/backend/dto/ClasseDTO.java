package com.projetstage.backend.dto;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Utilisateur;

import java.util.List;
import java.util.stream.Collectors;

public class ClasseDTO {
    private Long id;
    private String nom;
    private List<EtudiantDTO> etudiants; // DTO for students

    public ClasseDTO(Classe c) {
        this.id = c.getId();
        this.nom = c.getNom();
        if (c.getEtudiants() != null)
            this.etudiants = c.getEtudiants()
                               .stream()
                               .map(EtudiantDTO::new)
                               .collect(Collectors.toList());
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public List<EtudiantDTO> getEtudiants() { return etudiants; }

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

        public void setId(Long id) {
            this.id = id;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}

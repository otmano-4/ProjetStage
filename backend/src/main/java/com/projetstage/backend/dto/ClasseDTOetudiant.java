package com.projetstage.backend.dto;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Utilisateur;


public class ClasseDTOetudiant {
    private Long id;
    private String nom;

    public ClasseDTOetudiant(Classe c) {
        this.id = c.getId();
        this.nom = c.getNom();
        
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

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

        public void setEmail(String email) {
            this.email = email;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }
    }


    public static class CreateStudentDTO {

        private String nom;
        private String email;
        private String motDePasse;

        public CreateStudentDTO() {
            // Default constructor
        }

        public CreateStudentDTO(String nom, String email, String motDePasse) {
            this.nom = nom;
            this.email = email;
            this.motDePasse = motDePasse;
        }

        // Getters and Setters
        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMotDePasse() {
            return motDePasse;
        }

        public void setMotDePasse(String motDePasse) {
            this.motDePasse = motDePasse;
        }
    }
}

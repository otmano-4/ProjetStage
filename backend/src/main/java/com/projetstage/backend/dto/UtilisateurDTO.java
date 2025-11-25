package com.projetstage.backend.dto;

import com.projetstage.backend.model.Utilisateur;

public class UtilisateurDTO{
    private Long id;
    private String nom;
    private String email;
    private String role;

    public UtilisateurDTO(Utilisateur u) {
        this.id = u.getId();
        this.nom = u.getNom();
        this.email = u.getEmail();
        this.role = u.getRole().name();
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getEmail() { return email; }
    public String getRole() { return role; }

    public void setRole(String role) {
        this.role = role;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

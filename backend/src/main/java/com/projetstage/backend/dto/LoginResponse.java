package com.projetstage.backend.dto;

public class LoginResponse {

    private Long id;
    private String nom;
    private String email;
    private String role;
    private Long classeId;

    public LoginResponse(Long id, String nom, String email, String role, Long classeId) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.role = role;
        this.classeId = classeId;
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Long getClasseId() { return classeId; }
}

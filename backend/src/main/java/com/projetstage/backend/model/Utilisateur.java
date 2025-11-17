package com.projetstage.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "utilisateurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getEmail() {
        return email;
    }

    public enum Role { ADMIN, PROFESSEUR, ETUDIANT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String email;
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToMany(mappedBy = "etudiants")
    private List<Classe> classes;
}

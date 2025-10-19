package com.projetstage.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "examens")
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int duree; // en minutes

    private boolean afficher;

    private LocalDateTime datePublication;

    @ManyToOne
    @JoinColumn(name = "professeur_id", nullable = false)
    @JsonIgnoreProperties({"classes", "examens", "reponses", "motDePasse"})
    private Utilisateur professeur;

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    @JsonIgnoreProperties({"etudiants"})
    private Classe classe;

    // --- Constructors ---
    public Examen() {}

    public Examen(String titre, String description, int duree, boolean afficher,
                  LocalDateTime datePublication, Utilisateur professeur,
                  Classe classe) {
        this.titre = titre;
        this.description = description;
        this.duree = duree;
        this.afficher = afficher;
        this.datePublication = datePublication;
        this.professeur = professeur;
        this.classe = classe;
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public String getDescription() {
        return description;
    }

    public int getDuree() {
        return duree;
    }

    public boolean isAfficher() {
        return afficher;
    }

    public LocalDateTime getDatePublication() {
        return datePublication;
    }

    public Utilisateur getProfesseur() {
        return professeur;
    }

    public Classe getClasse() {
        return classe;
    }


    // --- Setters ---
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDuree(int duree) {
        this.duree = duree;
    }

    public void setAfficher(boolean afficher) {
        this.afficher = afficher;
    }

    public void setDatePublication(LocalDateTime datePublication) {
        this.datePublication = datePublication;
    }

    public void setProfesseur(Utilisateur professeur) {
        this.professeur = professeur;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

}

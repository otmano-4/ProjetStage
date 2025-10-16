package com.projetstage.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
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

    @OneToMany(mappedBy = "examen", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("examen")
    private List<Question> questions;

    // --- Constructors ---
    public Examen() {}

    public Examen(Long id, String titre, String description, int duree, boolean afficher,
                  LocalDateTime datePublication, Utilisateur professeur,
                  Classe classe, List<Question> questions) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.duree = duree;
        this.afficher = afficher;
        this.datePublication = datePublication;
        this.professeur = professeur;
        this.classe = classe;
        this.questions = questions;
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

    public List<Question> getQuestions() {
        return questions;
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

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}

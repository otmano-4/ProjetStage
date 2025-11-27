package com.projetstage.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "examens")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int duree; // minutes

    private boolean afficher;

    private LocalDateTime datePublication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professeur_id", nullable = false)
    @JsonIgnoreProperties({"classes", "examens", "reponses", "motDePasse"})
    private Utilisateur professeur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classe_id", nullable = false)
    @JsonIgnoreProperties({"etudiants"})
    private Classe classe;

    @OneToMany(
        mappedBy = "examen",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<Question> questions = new ArrayList<>();


    public Examen() {}

    public Examen(String titre, String description, int duree, boolean afficher,
                  LocalDateTime datePublication, Utilisateur professeur, Classe classe) {
        this.titre = titre;
        this.description = description;
        this.duree = duree;
        this.afficher = afficher;
        this.datePublication = datePublication;
        this.professeur = professeur;
        this.classe = classe;
    }

    public void addQuestion(Question q) {
        if (questions == null) questions = new ArrayList<>();
        questions.add(q);
        q.setExamen(this);
    }



    public void removeQuestion(Question q) {
        questions.remove(q);
        q.setExamen(null);
    }


    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }


    public void setId(Long id){
        this.id  = id;
    }

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

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setDescription(String description) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setDuree(int duree) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setAfficher(boolean afficher) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setDatePublication(LocalDateTime now) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setProfesseur(Utilisateur professeur) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setClasse(Classe classe) {
        throw new UnsupportedOperationException("Not supported yet.");
    }


    
}




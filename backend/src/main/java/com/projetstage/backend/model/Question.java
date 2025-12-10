package com.projetstage.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "questions")
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    // Barème (score max) pour la question
    private Double bareme = 1.0;

    // Compatibilité avec la colonne existante en base
    @Column(name = "contenu")
    private String contenu;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Type type;

    private String choix; // JSON string or comma-separated
    private String correct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id")
    private Examen examen;

    

    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public Double getBareme() {
        return bareme;
    }

    public String getContenu() {
        return contenu;
    }

    public Type getType() {
        return type;
    }

    public String getChoix() {
        return choix;
    }

    public String getCorrect() {
        return correct;
    }

    public Examen getExamen() {
        return examen;
    }

    void setExamen(Examen aThis) {
        this.examen = aThis;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setBareme(Double bareme) {
        this.bareme = bareme;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }
    
    public void setType(Type valueOf) {
        this.type = valueOf;
    }
    
    public void setChoix(String choix) {
        this.choix = choix;
    }

    public void setCorrect(String correct) {
        this.correct = correct;
    }

    public enum Type {
        TEXT, MULTIPLE, TRUE_FALSE
    }
}

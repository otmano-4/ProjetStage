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

@Entity
@Table(name = "questions")
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Enumerated(EnumType.STRING)
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

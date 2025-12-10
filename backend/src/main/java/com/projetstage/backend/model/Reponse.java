package com.projetstage.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reponses")
public class Reponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id", nullable = false)
    private Examen examen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "soumission_id")
    private SoumissionExamen soumission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Utilisateur etudiant;

    @Column(columnDefinition = "TEXT")
    private String reponse;

    private Double note; // 1.0 ou 0.0 pour auto-corrigé, null si à corriger

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Statut statut;

    public enum Statut {
        AUTO_CORRIGE,
        A_CORRIGER,
        CORRIGE_MANUEL
    }

    public Long getId() {
        return id;
    }

    public Examen getExamen() {
        return examen;
    }

    public void setExamen(Examen examen) {
        this.examen = examen;
    }

    public SoumissionExamen getSoumission() {
        return soumission;
    }

    public void setSoumission(SoumissionExamen soumission) {
        this.soumission = soumission;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Utilisateur getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Utilisateur etudiant) {
        this.etudiant = etudiant;
    }

    public String getReponse() {
        return reponse;
    }

    public void setReponse(String reponse) {
        this.reponse = reponse;
    }

    public Double getNote() {
        return note;
    }

    public void setNote(Double note) {
        this.note = note;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }
}


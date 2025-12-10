package com.projetstage.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "soumissions_examen")
public class SoumissionExamen {

    public enum Statut {
        EN_COURS, SOUMIS, CORRIGE, PUBLIE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id", nullable = false)
    private Examen examen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Utilisateur etudiant;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Statut statut = Statut.EN_COURS;

    private Double scoreAuto = 0.0;
    private Double scoreManuel = 0.0;
    private Double scoreTotal = 0.0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime startedAt; // Moment où l'étudiant a commencé l'examen
    private LocalDateTime submittedAt;
    private LocalDateTime correctedAt;
    private LocalDateTime publishedAt;

    public Long getId() {
        return id;
    }

    public Examen getExamen() {
        return examen;
    }

    public void setExamen(Examen examen) {
        this.examen = examen;
    }

    public Utilisateur getEtudiant() {
        return etudiant;
    }

    public void setEtudiant(Utilisateur etudiant) {
        this.etudiant = etudiant;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }

    public Double getScoreAuto() {
        return scoreAuto;
    }

    public void setScoreAuto(Double scoreAuto) {
        this.scoreAuto = scoreAuto;
    }

    public Double getScoreManuel() {
        return scoreManuel;
    }

    public void setScoreManuel(Double scoreManuel) {
        this.scoreManuel = scoreManuel;
    }

    public Double getScoreTotal() {
        return scoreTotal;
    }

    public void setScoreTotal(Double scoreTotal) {
        this.scoreTotal = scoreTotal;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getCorrectedAt() {
        return correctedAt;
    }

    public void setCorrectedAt(LocalDateTime correctedAt) {
        this.correctedAt = correctedAt;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}


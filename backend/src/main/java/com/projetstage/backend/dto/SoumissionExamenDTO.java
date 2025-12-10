package com.projetstage.backend.dto;

import com.projetstage.backend.model.SoumissionExamen;
import java.time.LocalDateTime;

public class SoumissionExamenDTO {
    private Long id;
    private Long examenId;
    private Long etudiantId;
    private String etudiantNom;
    private String statut;
    private Double scoreAuto;
    private Double scoreManuel;
    private Double scoreTotal;
    private LocalDateTime startedAt;
    private Long tempsRestantSecondes; // Temps restant en secondes

    public SoumissionExamenDTO(SoumissionExamen s) {
        this.id = s.getId();
        this.examenId = s.getExamen() != null ? s.getExamen().getId() : null;
        this.etudiantId = s.getEtudiant() != null ? s.getEtudiant().getId() : null;
        this.etudiantNom = s.getEtudiant() != null ? s.getEtudiant().getNom() : "Inconnu";
        this.statut = s.getStatut() != null ? s.getStatut().name() : "EN_COURS";
        this.scoreAuto = s.getScoreAuto();
        this.scoreManuel = s.getScoreManuel();
        this.scoreTotal = s.getScoreTotal();
        this.startedAt = s.getStartedAt();
        
        // Calculer le temps restant si l'examen a commencé
        try {
            if (s.getStartedAt() != null && s.getExamen() != null && s.getStatut() == SoumissionExamen.Statut.EN_COURS) {
                int dureeMinutes = s.getExamen().getDuree();
                LocalDateTime finExamen = s.getStartedAt().plusMinutes(dureeMinutes);
                LocalDateTime maintenant = LocalDateTime.now();
                long secondesRestantes = java.time.Duration.between(maintenant, finExamen).getSeconds();
                this.tempsRestantSecondes = secondesRestantes > 0 ? secondesRestantes : 0;
            } else {
                this.tempsRestantSecondes = null;
            }
        } catch (Exception e) {
            // En cas d'erreur (lazy loading, etc.), ne pas calculer le temps restant
            this.tempsRestantSecondes = null;
        }
    }

    public Long getId() { return id; }
    public Long getExamenId() { return examenId; }
    public Long getEtudiantId() { return etudiantId; }
    public String getEtudiantNom() { return etudiantNom; }
    public String getStatut() { return statut; }
    public Double getScoreAuto() { return scoreAuto; }
    public Double getScoreManuel() { return scoreManuel; }
    public Double getScoreTotal() { return scoreTotal; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public Long getTempsRestantSecondes() { return tempsRestantSecondes; }
    public void setTempsRestantSecondes(Long tempsRestantSecondes) { this.tempsRestantSecondes = tempsRestantSecondes; }
}


package com.projetstage.backend.dto;

import java.time.LocalDateTime;

public class CreateExamenRequest {
    private String titre;
    private String description;
    private int duree;
    private boolean afficher;
    private Long classeId;
    private Long professeurId;
    private LocalDateTime dateDebut; // Date/heure de début de l'examen
    private LocalDateTime dateFin;   // Date/heure de fin de l'examen

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getDuree() { return duree; }
    public void setDuree(int duree) { this.duree = duree; }

    public boolean isAfficher() { return afficher; }
    public void setAfficher(boolean afficher) { this.afficher = afficher; }

    public Long getClasseId() { return classeId; }
    public void setClasseId(Long classeId) { this.classeId = classeId; }

    public Long getProfesseurId() { return professeurId; }
    public void setProfesseurId(Long professeurId) { this.professeurId = professeurId; }

    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }

    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
}

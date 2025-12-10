package com.projetstage.backend.dto;

import com.projetstage.backend.model.Examen;
import java.time.LocalDateTime;

public class ExamenDTO {
    private Long id;
    private String titre;
    private String description;
    private int duree;
    private boolean afficher;
    private LocalDateTime datePublication;
    private LocalDateTime dateDebut; // Date/heure de début de l'examen
    private LocalDateTime dateFin;   // Date/heure de fin de l'examen
    private String professeurNom;

    // Constructeur qui prend un Examen et simplifie
    public ExamenDTO(Examen examen) {
        this.id = examen.getId();
        this.titre = examen.getTitre();
        this.description = examen.getDescription();
        this.duree = examen.getDuree();
        this.afficher = examen.isAfficher();
        this.datePublication = examen.getDatePublication();
        this.dateDebut = examen.getDateDebut();
        this.dateFin = examen.getDateFin();
        this.professeurNom = examen.getProfesseur().getNom();
    }

    // Getters (Lombok @Data possible si tu veux)
    public Long getId() { return id; }
    public String getTitre() { return titre; }
    public String getDescription() { return description; }
    public int getDuree() { return duree; }
    public LocalDateTime getDatePublication() { return datePublication; }
    public String getProfesseurNom() { return professeurNom; }
    public boolean  isAfficher() { return afficher; }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public void setProfesseurNom(String professeurNom) {
        this.professeurNom = professeurNom;
    }

    public void setDatePublication(LocalDateTime datePublication) {
        this.datePublication = datePublication;
    }

    public void setAfficher(boolean afficher) {
        this.afficher = afficher;
    }

    public void setDuree(int duree) {
        this.duree = duree;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }

    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
}

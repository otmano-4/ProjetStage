package com.projetstage.backend.dto;

import com.projetstage.backend.model.Examen;
import java.time.LocalDateTime;

public class ExamenDTO {
    private Long id;
    private String titre;
    private String description;
    private int duree;
    private LocalDateTime datePublication;
    private String professeurNom;

    // Constructeur qui prend un Examen et simplifie
    public ExamenDTO(Examen examen) {
        this.id = examen.getId();
        this.titre = examen.getTitre();
        this.description = examen.getDescription();
        this.duree = examen.getDuree();
        this.datePublication = examen.getDatePublication();
        this.professeurNom = examen.getProfesseur().getNom();
    }

    // Getters (Lombok @Data possible si tu veux)
    public Long getId() { return id; }
    public String getTitre() { return titre; }
    public String getDescription() { return description; }
    public int getDuree() { return duree; }
    public LocalDateTime getDatePublication() { return datePublication; }
    public String getProfesseurNom() { return professeurNom; }
}

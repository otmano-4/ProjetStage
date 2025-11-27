package com.projetstage.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ExamenDetailsDTO {
    private Long id;
    private String titre;
    private String description;
    private int duree;
    private boolean afficher;
    private LocalDateTime datePublication;
    private String professeurNom;

    public ExamenDetailsDTO(Long id, String titre, String description, int duree,
                            boolean afficher, LocalDateTime datePublication,
                            String professeurNom) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.duree = duree;
        this.afficher = afficher;
        this.datePublication = datePublication;
        this.professeurNom = professeurNom;
    }

    public Long getId() { return id; }
    public String getTitre() { return titre; }
    public String getDescription() { return description; }
    public int getDuree() { return duree; }
    public boolean isAfficher() { return afficher; }
    public LocalDateTime getDatePublication() { return datePublication; }
    public String getProfesseurNom() { return professeurNom; }
}

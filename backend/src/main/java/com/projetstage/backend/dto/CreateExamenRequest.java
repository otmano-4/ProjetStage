package com.projetstage.backend.dto;

public class CreateExamenRequest {
    private String titre;
    private String description;
    private int duree;
    private boolean afficher;
    private Long classeId;
    private Long professeurId;

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
}

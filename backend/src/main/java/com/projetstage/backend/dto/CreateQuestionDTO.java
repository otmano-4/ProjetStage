package com.projetstage.backend.dto;

public class CreateQuestionDTO {
    private String type;       // matches Question.Type enum
    private String titre;
    private String choix;      // options in entity
    private String correct;    // correct answer in entity
    private Double bareme;

    public String getType() { return type; }
    public String getTitre() { return titre; }
    public String getChoix() { return choix; }
    public String getCorrect() { return correct; }
    public Double getBareme() { return bareme; }

    // Setters nécessaires pour la désérialisation JSON
    public void setType(String type) { this.type = type; }
    public void setTitre(String titre) { this.titre = titre; }
    public void setChoix(String choix) { this.choix = choix; }
    public void setCorrect(String correct) { this.correct = correct; }
    public void setBareme(Double bareme) { this.bareme = bareme; }
}

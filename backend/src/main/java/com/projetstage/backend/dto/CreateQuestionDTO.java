package com.projetstage.backend.dto;

public class CreateQuestionDTO {
    private String type;       // matches Question.Type enum
    private String titre;
    private String choix;      // options in entity
    private String correct;    // correct answer in entity

    public String getType() { return type; }
    public String getTitre() { return titre; }
    public String getChoix() { return choix; }
    public String getCorrect() { return correct; }
}

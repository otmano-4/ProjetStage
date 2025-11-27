package com.projetstage.backend.dto;

public class CreateQuestionRequestDTO {
    private String titre;
    private String type;   // TEXT, MULTIPLE, TRUE_FALSE
    private String choix;  // if MULTIPLE
    private String correct;

    public String getTitre() {
        return titre;
    }

    public String getCorrect() {
        return correct;
    }

    public String getChoix() {
        return choix;
    }

    public String getType() {
        return type;
    }
    
}

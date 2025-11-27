package com.projetstage.backend.dto;

import com.projetstage.backend.model.Question;

public class QuestionDTO {
    private Long id;
    private String type;
    private String titre;
    private String choix;
    private String correct;

    public QuestionDTO(Question q) {
        this.id = q.getId();
        this.type = q.getType().name();
        this.titre = q.getTitre();
        this.choix = q.getChoix();
        this.correct = q.getCorrect();
    }

    public Long getId() { return id; }
    public String getType() { return type; }
    public String getTitre() { return titre; }
    public String getChoix() { return choix; }
    public String getCorrect() { return correct; }
}

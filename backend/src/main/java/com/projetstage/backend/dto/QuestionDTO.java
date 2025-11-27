package com.projetstage.backend.dto;

import com.projetstage.backend.model.Question;

public class QuestionDTO {
    private Long id;
    private String titre;
    private String type;
    private String correct;

    public QuestionDTO(Question q) {
        this.id = q.getId();
        this.titre = q.getTitre();
        this.type = q.getType().name();
        this.correct = q.getCorrect();
    }
}

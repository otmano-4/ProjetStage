package com.projetstage.backend.dto;

import com.projetstage.backend.model.Question;

public class QuestionDTO {
    private Long id;
    private String contenu;
    private String type;
    private String options;

    public QuestionDTO(Question q) {
        this.id = q.getId();
        this.contenu = q.getContenu();
        this.type = q.getType().name();
        this.options = q.getOptions();
    }

    public Long getId() { return id; }
    public String getContenu() { return contenu; }
    public String getType() { return type; }
    public String getOptions() { return options; }
}

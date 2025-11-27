package com.projetstage.backend.dto;

import com.projetstage.backend.model.Question;

public class QuestionDTO {
    private Long id;
    private String type;
    private String contenu;
    private String options;
    private String reponseCorrecte;

    // Default constructor for Jackson
    public QuestionDTO() {}

    // Constructor from Question entity
    public QuestionDTO(Question q) {
        this.id = q.getId();
        this.type = q.getType().name();
        this.contenu = q.getContenu();
        this.options = q.getOptions();
        this.reponseCorrecte = q.getReponseCorrecte();
    }

    // Getters
    public Long getId() { return id; }
    public String getType() { return type; }
    public String getContenu() { return contenu; }
    public String getOptions() { return options; }
    public String getReponseCorrecte() { return reponseCorrecte; }

    // Setters (needed for Jackson deserialization)
    public void setId(Long id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setContenu(String contenu) { this.contenu = contenu; }
    public void setOptions(String options) { this.options = options; }
    public void setReponseCorrecte(String reponseCorrecte) { this.reponseCorrecte = reponseCorrecte; }
}

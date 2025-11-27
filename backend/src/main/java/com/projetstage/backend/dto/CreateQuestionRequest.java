package com.projetstage.backend.dto;

public class CreateQuestionRequest {
    private String type; // QCM, VF, ...
    private String contenu;
    private String options; // JSON string for QCM options
    private String reponseCorrecte;

    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }

    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }

    public String getReponseCorrecte() { return reponseCorrecte; }
    public void setReponseCorrecte(String reponseCorrecte) { this.reponseCorrecte = reponseCorrecte; }
}

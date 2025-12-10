package com.projetstage.backend.dto;

public class SubmitQuestionResponseDTO {
    private Long questionId;
    private String reponse;

    public Long getQuestionId() {
        return questionId;
    }

    public String getReponse() {
        return reponse;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public void setReponse(String reponse) {
        this.reponse = reponse;
    }
}


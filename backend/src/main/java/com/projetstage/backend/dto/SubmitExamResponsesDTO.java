package com.projetstage.backend.dto;

import java.util.List;

public class SubmitExamResponsesDTO {
    private Long etudiantId;
    private List<SubmitQuestionResponseDTO> responses;

    public Long getEtudiantId() {
        return etudiantId;
    }

    public List<SubmitQuestionResponseDTO> getResponses() {
        return responses;
    }

    public void setEtudiantId(Long etudiantId) {
        this.etudiantId = etudiantId;
    }

    public void setResponses(List<SubmitQuestionResponseDTO> responses) {
        this.responses = responses;
    }
}


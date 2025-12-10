package com.projetstage.backend.dto;

import com.projetstage.backend.model.Reponse;
import com.projetstage.backend.model.Question;

public class ReponseDTO {
    private Long id;
    private Long soumissionId;
    private Long questionId;
    private String questionTitre;
    private String type;
    private String questionChoix; // Options pour MULTIPLE/TRUE_FALSE
    private String questionCorrect; // Réponse correcte
    private Double questionBareme; // Barème de la question
    private Long etudiantId;
    private String etudiantNom;
    private String reponse;
    private Double note;
    private String statut;

    public ReponseDTO(Reponse r) {
        this.id = r.getId();
        this.soumissionId = r.getSoumission() != null ? r.getSoumission().getId() : null;
        this.questionId = r.getQuestion() != null ? r.getQuestion().getId() : null;
        this.questionTitre = r.getQuestion() != null ? r.getQuestion().getTitre() : "Question inconnue";
        Question.Type qt = r.getQuestion() != null ? r.getQuestion().getType() : null;
        this.type = qt != null ? qt.name() : null;
        this.questionChoix = r.getQuestion() != null ? r.getQuestion().getChoix() : null;
        this.questionCorrect = r.getQuestion() != null ? r.getQuestion().getCorrect() : null;
        this.questionBareme = r.getQuestion() != null ? r.getQuestion().getBareme() : null;
        this.etudiantId = r.getEtudiant() != null ? r.getEtudiant().getId() : null;
        this.etudiantNom = r.getEtudiant() != null ? r.getEtudiant().getNom() : "Étudiant inconnu";
        this.reponse = r.getReponse();
        this.note = r.getNote();
        this.statut = r.getStatut() != null ? r.getStatut().name() : null;
    }

    public Long getId() { return id; }
    public Long getSoumissionId() { return soumissionId; }
    public Long getQuestionId() { return questionId; }
    public String getQuestionTitre() { return questionTitre; }
    public String getType() { return type; }
    public String getQuestionChoix() { return questionChoix; }
    public String getQuestionCorrect() { return questionCorrect; }
    public Double getQuestionBareme() { return questionBareme; }
    public Long getEtudiantId() { return etudiantId; }
    public String getEtudiantNom() { return etudiantNom; }
    public String getReponse() { return reponse; }
    public Double getNote() { return note; }
    public String getStatut() { return statut; }
}


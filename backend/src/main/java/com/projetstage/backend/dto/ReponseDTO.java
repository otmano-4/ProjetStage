package com.projetstage.backend.dto;

import com.projetstage.backend.model.Reponse;
import java.time.LocalDateTime;

public class ReponseDTO {
    private Long id;
    private String contenu;
    private Double note;
    private LocalDateTime dateSoumission;
    private String questionContenu;
    private String etudiantNom;

    public ReponseDTO(Reponse r) {
        this.id = r.getId();
        this.contenu = r.getContenu();
        this.note = r.getNote();
        this.dateSoumission = r.getDateSoumission();
        this.questionContenu = r.getQuestion().getContenu();
        this.etudiantNom = r.getEtudiant().getNom();
    }

    public Long getId() { return id; }
    public String getContenu() { return contenu; }
    public Double getNote() { return note; }
    public LocalDateTime getDateSoumission() { return dateSoumission; }
    public String getQuestionContenu() { return questionContenu; }
    public String getEtudiantNom() { return etudiantNom; }
}

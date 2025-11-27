package com.projetstage.backend.dto;
import com.projetstage.backend.model.Examen;

import java.time.LocalDateTime;
import java.util.List;

public class ExamenDetailsQuestionsDTO {

    private Long id;
    private String titre;
    private String description;
    private int duree;
    private boolean afficher;
    private LocalDateTime datePublication;
    private String professeurNom;

    private List<QuestionDTO> questions; // ✅ ADD THIS

    // Full constructor used in controller
    public ExamenDetailsQuestionsDTO(Examen examen, List<QuestionDTO> questions) {
        this.id = examen.getId();
        this.titre = examen.getTitre();
        this.description = examen.getDescription();
        this.duree = examen.getDuree();
        this.afficher = examen.isAfficher();
        this.datePublication = examen.getDatePublication();
        this.professeurNom = examen.getProfesseur().getNom();
        this.questions = questions;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitre() { return titre; }
    public String getDescription() { return description; }
    public int getDuree() { return duree; }
    public boolean isAfficher() { return afficher; }
    public LocalDateTime getDatePublication() { return datePublication; }
    public String getProfesseurNom() { return professeurNom; }
    public List<QuestionDTO> getQuestions() { return questions; } // ✅ Getter
}

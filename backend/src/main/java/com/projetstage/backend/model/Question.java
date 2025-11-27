package com.projetstage.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type; // QCM, VF, etc.

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    // Stored as JSON-style text for flexibility
    @Column(columnDefinition = "TEXT")
    private String options;

    @Column(name = "reponse_correcte", columnDefinition = "TEXT")
    private String reponseCorrecte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id", nullable = false)
    @JsonIgnoreProperties("questions")
    private Examen examen;

    public Long getId() {
        return id;
    }

    public Type getType() {
        return type;
    }

    public String getOptions() {
        return options;
    }

    public Examen getExamen() {
        return examen;
    }

    public String getReponseCorrecte() {
        return reponseCorrecte;
    }

    public String getContenu() {
        return contenu;
    }

    public void setExamen(Examen examen) {
        this.examen = examen;
    }

    public void setReponseCorrecte(String reponseCorrecte) {
        this.reponseCorrecte = reponseCorrecte;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public void setType(Type valueOf) {
        this.type = valueOf;
    }

    public enum Type {
        QCM,       // Multiple choice
        VF,        // True/False
        OUI_NON,
        TEXTE_TROU,
        OUVERTE,
        PIECE_JOINTE
    }
}

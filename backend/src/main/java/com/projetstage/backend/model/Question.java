package com.projetstage.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Data @NoArgsConstructor @AllArgsConstructor
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type; // QCM, VF, ...

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    // On stocke les options en texte JSON pour QCM (simple au début)
    @Column(columnDefinition = "TEXT")
    private String options;

    @Column(name = "reponse_correcte", columnDefinition = "TEXT")
    private String reponseCorrecte;

    @ManyToOne @JoinColumn(name = "examen_id", nullable = false)
    private Examen examen;

    public enum Type { QCM, VF, OUI_NON, TEXTE_TROU, OUVERTE, PIECE_JOINTE }
}

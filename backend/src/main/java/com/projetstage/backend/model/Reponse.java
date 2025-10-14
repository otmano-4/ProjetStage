package com.projetstage.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "reponses")
@Data @NoArgsConstructor @AllArgsConstructor
public class Reponse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String contenu;

    private LocalDateTime dateSoumission = LocalDateTime.now();
    private Double note; // ✅ note attribuée

    @ManyToOne @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnoreProperties("reponses")   // 🔥 empêche la boucle
    private Question question;

    @ManyToOne @JoinColumn(name = "etudiant_id", nullable = false)
    @JsonIgnoreProperties("reponses")   // 🔥 idem pour éviter la boucle
    private Utilisateur etudiant;
}

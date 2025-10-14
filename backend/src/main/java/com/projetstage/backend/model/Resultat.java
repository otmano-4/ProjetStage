package com.projetstage.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resultats")
@Data @NoArgsConstructor @AllArgsConstructor
public class Resultat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne @JoinColumn(name = "etudiant_id", nullable = false)
    @JsonIgnoreProperties({"resultats", "examens", "reponses"}) // 🔥 éviter boucle
    private Utilisateur etudiant;
    
    @ManyToOne @JoinColumn(name = "examen_id", nullable = false)
    @JsonIgnoreProperties({"resultats", "questions"}) // 🔥 éviter boucle
    private Examen examen;

    private Double noteFinale; // ✅ total des points obtenus
}

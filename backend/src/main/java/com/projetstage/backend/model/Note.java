package com.projetstage.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notes")
@Data @NoArgsConstructor @AllArgsConstructor
public class Note {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valeur;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @ManyToOne @JoinColumn(name = "examen_id", nullable = false)
    private Examen examen;

    @ManyToOne @JoinColumn(name = "etudiant_id", nullable = false)
    private Utilisateur etudiant;
}

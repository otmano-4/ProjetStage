package com.projetstage.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "examens")
@Data @NoArgsConstructor @AllArgsConstructor
public class Examen {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int duree; // minutes

    private LocalDateTime datePublication;

    @ManyToOne
    @JoinColumn(name = "professeur_id", nullable = false)
    @JsonIgnoreProperties({"classes", "examens", "reponses", "motDePasse"}) // empêche boucle
    private Utilisateur professeur;

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    @JsonIgnoreProperties({"etudiants"}) // on ignore les étudiants pour éviter cycle
    private Classe classe;

    @OneToMany(mappedBy = "examen", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("examen") // empêche boucle examen → question → examen
    private List<Question> questions;
}

package com.projetstage.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "classes")
@Data @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Classe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToMany
    @JoinTable(
        name = "etudiants_classes",
        joinColumns = @JoinColumn(name = "classe_id"),
        inverseJoinColumns = @JoinColumn(name = "utilisateur_id")
    )
    @JsonIgnoreProperties({"classes", "examens", "reponses", "motDePasse"}) 
    private List<Utilisateur> etudiants;
}

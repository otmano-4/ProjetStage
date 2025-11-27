package com.projetstage.backend.dto;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Utilisateur;
import java.util.List;
import java.util.stream.Collectors;

public class ClasseDTO {

    private Long id;
    private String nom;
    private List<UtilisateurDTO> etudiants;
    private List<UtilisateurDTO> professeurs;

    public ClasseDTO(Classe c) {
        this.id = c.getId();
        this.nom = c.getNom();

        if (c.getEtudiants() != null)
            this.etudiants = c.getEtudiants().stream()
                    .map(UtilisateurDTO::new)
                    .collect(Collectors.toList());

        if (c.getProfesseurs() != null)
            this.professeurs = c.getProfesseurs().stream()
                    .map(UtilisateurDTO::new)
                    .collect(Collectors.toList());
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public List<UtilisateurDTO> getEtudiants() { return etudiants; }
    public List<UtilisateurDTO> getProfesseurs() { return professeurs; }

    public static class UtilisateurDTO {
        private Long id;
        private String nom;
        private String email;

        public UtilisateurDTO(Utilisateur u) {
            this.id = u.getId();
            this.nom = u.getNom();
            this.email = u.getEmail();
        }

        public Long getId() { return id; }
        public String getNom() { return nom; }
        public String getEmail() { return email; }
    }
}

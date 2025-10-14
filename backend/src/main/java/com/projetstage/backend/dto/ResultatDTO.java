package com.projetstage.backend.dto;

import com.projetstage.backend.model.Resultat;

public class ResultatDTO {
    private Long id;
    private String etudiantNom;
    private String examenTitre;
    private Double noteFinale;

    public ResultatDTO(Resultat r) {
        this.id = r.getId();
        this.etudiantNom = r.getEtudiant().getNom();
        this.examenTitre = r.getExamen().getTitre();
        this.noteFinale = r.getNoteFinale();
    }

    public Long getId() { return id; }
    public String getEtudiantNom() { return etudiantNom; }
    public String getExamenTitre() { return examenTitre; }
    public Double getNoteFinale() { return noteFinale; }
}

package com.projetstage.backend.dto;

import com.projetstage.backend.model.Note;

public class NoteDTO {
    private Long id;
    private Double valeur;
    private String commentaire;
    private String etudiantNom;
    private String examenTitre;

    public NoteDTO(Note note) {
        this.id = note.getId();
        this.valeur = note.getValeur();
        this.commentaire = note.getCommentaire();
        this.etudiantNom = note.getEtudiant().getNom();
        this.examenTitre = note.getExamen().getTitre();
    }

    public Long getId() { return id; }
    public Double getValeur() { return valeur; }
    public String getCommentaire() { return commentaire; }
    public String getEtudiantNom() { return etudiantNom; }
    public String getExamenTitre() { return examenTitre; }
}

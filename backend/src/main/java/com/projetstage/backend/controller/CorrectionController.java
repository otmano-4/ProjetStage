package com.projetstage.backend.controller;

import com.projetstage.backend.model.*;
import com.projetstage.backend.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/examens")
public class CorrectionController {

    private final ExamenRepository examenRepository;
    private final ReponseRepository reponseRepository;
    private final ResultatRepository resultatRepository;

    public CorrectionController(ExamenRepository examenRepository,
                                ReponseRepository reponseRepository,
                                ResultatRepository resultatRepository) {
        this.examenRepository = examenRepository;
        this.reponseRepository = reponseRepository;
        this.resultatRepository = resultatRepository;
    }

    // ✅ Correction automatique d’un examen
    @PostMapping("/{id}/corriger")
    public String corrigerExamen(@PathVariable Long id) {
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        // Récupérer toutes les réponses liées à cet examen
        List<Reponse> reponses = reponseRepository.findAll()
                .stream()
                .filter(r -> r.getQuestion().getExamen().getId().equals(id))
                .collect(Collectors.toList());

        // Grouper par étudiant
        Map<Utilisateur, List<Reponse>> reponsesParEtudiant =
                reponses.stream().collect(Collectors.groupingBy(Reponse::getEtudiant));

        for (Map.Entry<Utilisateur, List<Reponse>> entry : reponsesParEtudiant.entrySet()) {
            Utilisateur etudiant = entry.getKey();
            List<Reponse> reps = entry.getValue();

            double total = 0.0;

            for (Reponse r : reps) {
                Question q = r.getQuestion();

                // ✅ Correction automatique uniquement si QCM
                if (q.getType() == Question.Type.QCM) {
                    if (q.getReponseCorrecte() != null &&
                            q.getReponseCorrecte().equalsIgnoreCase(r.getContenu())) {
                        r.setNote(1.0);
                        total += 1.0;
                    } else {
                        r.setNote(0.0);
                    }
                } else {
                    // Réponse ouverte → à corriger manuellement
                    r.setNote(null);
                }
                reponseRepository.save(r);
            }

            // Sauvegarder le résultat global
            Resultat resultat = new Resultat();
            resultat.setEtudiant(etudiant);
            resultat.setExamen(examen);
            resultat.setNoteFinale(total);

            resultatRepository.save(resultat);
        }

        return "✅ Correction terminée pour l’examen : " + examen.getTitre();
    }

    // ✅ Correction manuelle d'une réponse ouverte
    @PutMapping("/reponses/{id}/noter")
    public Reponse noterReponse(@PathVariable Long id, @RequestParam Double note) {
        Reponse reponse = reponseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réponse introuvable"));
        reponse.setNote(note);
        return reponseRepository.save(reponse);
    }
}

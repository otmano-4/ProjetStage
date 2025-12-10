package com.projetstage.backend.controller;

import com.projetstage.backend.model.Examen;
import com.projetstage.backend.model.SoumissionExamen;
import com.projetstage.backend.repository.ExamenRepository;
import com.projetstage.backend.repository.SoumissionExamenRepository;
import com.projetstage.backend.repository.ReponseRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final ExamenRepository examenRepository;
    private final SoumissionExamenRepository soumissionExamenRepository;
    private final ReponseRepository reponseRepository;

    public StatisticsController(ExamenRepository examenRepository,
                                SoumissionExamenRepository soumissionExamenRepository,
                                ReponseRepository reponseRepository) {
        this.examenRepository = examenRepository;
        this.soumissionExamenRepository = soumissionExamenRepository;
        this.reponseRepository = reponseRepository;
    }

    // Statistiques pour un examen spécifique
    @GetMapping("/examens/{examId}")
    public Map<String, Object> getExamStatistics(@PathVariable Long examId) {
        Examen examen = examenRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        List<SoumissionExamen> soumissions = soumissionExamenRepository.findByExamenIdWithRelations(examId);
        
        // Filtrer seulement les soumissions publiées pour les stats
        List<SoumissionExamen> soumissionsPubliees = soumissions.stream()
                .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        
        if (soumissionsPubliees.isEmpty()) {
            stats.put("message", "Aucune soumission publiée pour cet examen");
            stats.put("nombreSoumissions", 0);
            return stats;
        }

        // Calculer le total des points possibles
        double totalPoints = examen.getQuestions().stream()
                .mapToDouble(q -> q.getBareme() != null ? q.getBareme() : 0.0)
                .sum();

        // Statistiques de base
        int nombreSoumissions = soumissionsPubliees.size();
        double moyenne = soumissionsPubliees.stream()
                .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                .average()
                .orElse(0.0);
        
        double scoreMax = soumissionsPubliees.stream()
                .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                .max()
                .orElse(0.0);
        
        double scoreMin = soumissionsPubliees.stream()
                .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                .min()
                .orElse(0.0);

        // Taux de réussite (>= 50% du total)
        long nombreReussis = soumissionsPubliees.stream()
                .filter(s -> s.getScoreTotal() != null && s.getScoreTotal() >= (totalPoints * 0.5))
                .count();
        double tauxReussite = nombreSoumissions > 0 ? (nombreReussis * 100.0 / nombreSoumissions) : 0.0;

        // Distribution des notes (par tranches de 10%)
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("0-10%", 0L);
        distribution.put("10-20%", 0L);
        distribution.put("20-30%", 0L);
        distribution.put("30-40%", 0L);
        distribution.put("40-50%", 0L);
        distribution.put("50-60%", 0L);
        distribution.put("60-70%", 0L);
        distribution.put("70-80%", 0L);
        distribution.put("80-90%", 0L);
        distribution.put("90-100%", 0L);

        for (SoumissionExamen s : soumissionsPubliees) {
            double score = s.getScoreTotal() != null ? s.getScoreTotal() : 0.0;
            double pourcentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
            
            if (pourcentage < 10) distribution.put("0-10%", distribution.get("0-10%") + 1);
            else if (pourcentage < 20) distribution.put("10-20%", distribution.get("10-20%") + 1);
            else if (pourcentage < 30) distribution.put("20-30%", distribution.get("20-30%") + 1);
            else if (pourcentage < 40) distribution.put("30-40%", distribution.get("30-40%") + 1);
            else if (pourcentage < 50) distribution.put("40-50%", distribution.get("40-50%") + 1);
            else if (pourcentage < 60) distribution.put("50-60%", distribution.get("50-60%") + 1);
            else if (pourcentage < 70) distribution.put("60-70%", distribution.get("60-70%") + 1);
            else if (pourcentage < 80) distribution.put("70-80%", distribution.get("70-80%") + 1);
            else if (pourcentage < 90) distribution.put("80-90%", distribution.get("80-90%") + 1);
            else distribution.put("90-100%", distribution.get("90-100%") + 1);
        }

        // Statistiques par question
        List<Map<String, Object>> statsParQuestion = new ArrayList<>();
        for (var question : examen.getQuestions()) {
            Map<String, Object> qStats = new HashMap<>();
            qStats.put("questionId", question.getId());
            qStats.put("questionTitre", question.getTitre());
            qStats.put("type", question.getType().name());
            qStats.put("bareme", question.getBareme());

            // Pour les questions auto-corrigées, calculer le taux de réussite
            if (question.getType() != com.projetstage.backend.model.Question.Type.TEXT) {
                List<com.projetstage.backend.model.Reponse> reponsesQuestion = new ArrayList<>();
                for (SoumissionExamen soum : soumissionsPubliees) {
                    List<com.projetstage.backend.model.Reponse> reps = reponseRepository.findBySoumissionIdWithRelations(soum.getId());
                    reponsesQuestion.addAll(reps);
                }
                long nombreCorrectes = reponsesQuestion.stream()
                        .filter(r -> r.getQuestion() != null && r.getQuestion().getId().equals(question.getId()))
                        .filter(r -> r.getStatut() == com.projetstage.backend.model.Reponse.Statut.AUTO_CORRIGE)
                        .filter(r -> r.getNote() != null && r.getNote() > 0)
                        .count();
                
                double tauxReussiteQuestion = nombreSoumissions > 0 ? (nombreCorrectes * 100.0 / nombreSoumissions) : 0.0;
                qStats.put("tauxReussite", Math.round(tauxReussiteQuestion * 100.0) / 100.0);
                qStats.put("nombreCorrectes", nombreCorrectes);
            } else {
                // Pour les questions TEXT, moyenne des notes
                List<com.projetstage.backend.model.Reponse> reponsesQuestion = new ArrayList<>();
                for (SoumissionExamen soum : soumissionsPubliees) {
                    List<com.projetstage.backend.model.Reponse> reps = reponseRepository.findBySoumissionIdWithRelations(soum.getId());
                    reponsesQuestion.addAll(reps);
                }
                double moyenneQuestion = reponsesQuestion.stream()
                        .filter(r -> r.getQuestion() != null && r.getQuestion().getId().equals(question.getId()))
                        .filter(r -> r.getNote() != null)
                        .mapToDouble(com.projetstage.backend.model.Reponse::getNote)
                        .average()
                        .orElse(0.0);
                qStats.put("moyenneNote", Math.round(moyenneQuestion * 100.0) / 100.0);
            }

            statsParQuestion.add(qStats);
        }

        stats.put("examenId", examId);
        stats.put("examenTitre", examen.getTitre());
        stats.put("nombreSoumissions", nombreSoumissions);
        stats.put("totalPoints", totalPoints);
        stats.put("moyenne", Math.round(moyenne * 100.0) / 100.0);
        stats.put("scoreMax", scoreMax);
        stats.put("scoreMin", scoreMin);
        stats.put("tauxReussite", Math.round(tauxReussite * 100.0) / 100.0);
        stats.put("nombreReussis", nombreReussis);
        stats.put("distribution", distribution);
        stats.put("statsParQuestion", statsParQuestion);

        return stats;
    }

    // Statistiques globales pour un professeur
    @GetMapping("/professeurs/{professeurId}")
    public Map<String, Object> getProfessorStatistics(@PathVariable Long professeurId) {
        List<Examen> examens = examenRepository.findAll().stream()
                .filter(e -> e.getProfesseur().getId().equals(professeurId))
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("nombreExamens", examens.size());
        
        int totalSoumissions = 0;
        double moyenneGlobale = 0.0;
        int nombreExamensAvecSoumissions = 0;

        for (Examen examen : examens) {
            List<SoumissionExamen> soumissions = soumissionExamenRepository.findByExamenIdWithRelations(examen.getId())
                    .stream()
                    .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                    .collect(Collectors.toList());
            
            if (!soumissions.isEmpty()) {
                totalSoumissions += soumissions.size();
                double moyenneExamen = soumissions.stream()
                        .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                        .average()
                        .orElse(0.0);
                moyenneGlobale += moyenneExamen;
                nombreExamensAvecSoumissions++;
            }
        }

        if (nombreExamensAvecSoumissions > 0) {
            moyenneGlobale = moyenneGlobale / nombreExamensAvecSoumissions;
        }

        stats.put("totalSoumissions", totalSoumissions);
        stats.put("moyenneGlobale", Math.round(moyenneGlobale * 100.0) / 100.0);
        stats.put("nombreExamensAvecSoumissions", nombreExamensAvecSoumissions);

        return stats;
    }
}


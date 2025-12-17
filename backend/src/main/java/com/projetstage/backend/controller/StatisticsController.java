package com.projetstage.backend.controller;

import com.projetstage.backend.model.Examen;
import com.projetstage.backend.model.SoumissionExamen;
import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Utilisateur;
import com.projetstage.backend.repository.ExamenRepository;
import com.projetstage.backend.repository.SoumissionExamenRepository;
import com.projetstage.backend.repository.ReponseRepository;
import com.projetstage.backend.repository.ClasseRepository;
import com.projetstage.backend.repository.UtilisateurRepository;
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
    private final ClasseRepository classeRepository;
    private final UtilisateurRepository utilisateurRepository;

    public StatisticsController(ExamenRepository examenRepository,
                                SoumissionExamenRepository soumissionExamenRepository,
                                ReponseRepository reponseRepository,
                                ClasseRepository classeRepository,
                                UtilisateurRepository utilisateurRepository) {
        this.examenRepository = examenRepository;
        this.soumissionExamenRepository = soumissionExamenRepository;
        this.reponseRepository = reponseRepository;
        this.classeRepository = classeRepository;
        this.utilisateurRepository = utilisateurRepository;
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
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> getProfessorStatistics(@PathVariable Long professeurId) {
        // Récupérer les IDs des examens du professeur
        List<Long> examenIds = examenRepository.findAll().stream()
                .filter(e -> e.getProfesseur() != null && e.getProfesseur().getId().equals(professeurId))
                .map(Examen::getId)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("nombreExamens", examenIds.size());
        
        int totalSoumissions = 0;
        double moyenneGlobale = 0.0;
        int nombreExamensAvecSoumissions = 0;

        // Charger les examens avec leurs questions
        List<Examen> examensAvecQuestions = new ArrayList<>();
        for (Long examId : examenIds) {
            examenRepository.findByIdWithQuestions(examId).ifPresent(examensAvecQuestions::add);
        }

        for (Examen examen : examensAvecQuestions) {
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

        // Statistiques par examen (pour graphiques)
        List<Map<String, Object>> statsParExamen = new ArrayList<>();
        for (Examen examen : examensAvecQuestions) {
            List<SoumissionExamen> soumissions = soumissionExamenRepository.findByExamenIdWithRelations(examen.getId())
                    .stream()
                    .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                    .collect(Collectors.toList());
            
            if (!soumissions.isEmpty()) {
                Map<String, Object> examStats = new HashMap<>();
                examStats.put("examenId", examen.getId());
                examStats.put("examenTitre", examen.getTitre());
                examStats.put("nombreSoumissions", soumissions.size());
                
                // Les questions sont déjà chargées grâce à findByIdWithQuestions
                double totalPoints = examen.getQuestions().stream()
                        .mapToDouble(q -> q.getBareme() != null ? q.getBareme() : 0.0)
                        .sum();
                
                double moyenneExamen = soumissions.stream()
                        .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                        .average()
                        .orElse(0.0);
                
                examStats.put("moyenne", Math.round(moyenneExamen * 100.0) / 100.0);
                examStats.put("totalPoints", totalPoints);
                statsParExamen.add(examStats);
            }
        }
        stats.put("statsParExamen", statsParExamen);

        // Distribution des notes globales
        Map<String, Long> distributionGlobale = new HashMap<>();
        distributionGlobale.put("0-10%", 0L);
        distributionGlobale.put("10-20%", 0L);
        distributionGlobale.put("20-30%", 0L);
        distributionGlobale.put("30-40%", 0L);
        distributionGlobale.put("40-50%", 0L);
        distributionGlobale.put("50-60%", 0L);
        distributionGlobale.put("60-70%", 0L);
        distributionGlobale.put("70-80%", 0L);
        distributionGlobale.put("80-90%", 0L);
        distributionGlobale.put("90-100%", 0L);

        for (Examen examen : examensAvecQuestions) {
            List<SoumissionExamen> soumissions = soumissionExamenRepository.findByExamenIdWithRelations(examen.getId())
                    .stream()
                    .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                    .collect(Collectors.toList());
            
            // Les questions sont déjà chargées
            double totalPoints = examen.getQuestions().stream()
                    .mapToDouble(q -> q.getBareme() != null ? q.getBareme() : 0.0)
                    .sum();
            
            for (SoumissionExamen s : soumissions) {
                double score = s.getScoreTotal() != null ? s.getScoreTotal() : 0.0;
                double pourcentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
                
                if (pourcentage < 10) distributionGlobale.put("0-10%", distributionGlobale.get("0-10%") + 1);
                else if (pourcentage < 20) distributionGlobale.put("10-20%", distributionGlobale.get("10-20%") + 1);
                else if (pourcentage < 30) distributionGlobale.put("20-30%", distributionGlobale.get("20-30%") + 1);
                else if (pourcentage < 40) distributionGlobale.put("30-40%", distributionGlobale.get("30-40%") + 1);
                else if (pourcentage < 50) distributionGlobale.put("40-50%", distributionGlobale.get("40-50%") + 1);
                else if (pourcentage < 60) distributionGlobale.put("50-60%", distributionGlobale.get("50-60%") + 1);
                else if (pourcentage < 70) distributionGlobale.put("60-70%", distributionGlobale.get("60-70%") + 1);
                else if (pourcentage < 80) distributionGlobale.put("70-80%", distributionGlobale.get("70-80%") + 1);
                else if (pourcentage < 90) distributionGlobale.put("80-90%", distributionGlobale.get("80-90%") + 1);
                else distributionGlobale.put("90-100%", distributionGlobale.get("90-100%") + 1);
            }
        }
        stats.put("distributionGlobale", distributionGlobale);

        // Statistiques par classe
        List<Map<String, Object>> statsParClasse = new ArrayList<>();
        List<Classe> classes = classeRepository.findAllByProfesseurId(professeurId);
        
        for (Classe classe : classes) {
            // Récupérer tous les examens de cette classe créés par ce professeur
            // Utiliser les examens déjà chargés avec leurs questions
            List<Examen> examensClasse = new ArrayList<>();
            for (Examen examen : examensAvecQuestions) {
                // Charger la classe si nécessaire (elle est en LAZY)
                if (examen.getClasse() != null && examen.getClasse().getId().equals(classe.getId())) {
                    examensClasse.add(examen);
                } else {
                    // Si la classe n'est pas chargée, vérifier via l'ID de classe de l'examen
                    // On peut aussi utiliser une requête pour charger les examens avec leur classe
                    try {
                        Examen examWithClasse = examenRepository.findById(examen.getId()).orElse(null);
                        if (examWithClasse != null && examWithClasse.getClasse() != null && 
                            examWithClasse.getClasse().getId().equals(classe.getId())) {
                            examensClasse.add(examen);
                        }
                    } catch (Exception e) {
                        // Ignorer les erreurs de lazy loading
                    }
                }
            }
            
            // Alternative : utiliser findByClasseId du repository
            List<Examen> examensParClasse = examenRepository.findByClasseId(classe.getId());
            examensClasse = examensParClasse.stream()
                    .filter(e -> e.getProfesseur() != null && e.getProfesseur().getId().equals(professeurId))
                    .collect(Collectors.toList());
            
            int nombreSoumissions = 0;
            double sommeScores = 0.0;
            int nombreSoumissionsAvecScore = 0;
            
            for (Examen examen : examensClasse) {
                List<SoumissionExamen> soumissions = soumissionExamenRepository.findByExamenIdWithRelations(examen.getId())
                        .stream()
                        .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                        .collect(Collectors.toList());
                
                nombreSoumissions += soumissions.size();
                
                for (SoumissionExamen s : soumissions) {
                    if (s.getScoreTotal() != null) {
                        sommeScores += s.getScoreTotal();
                        nombreSoumissionsAvecScore++;
                    }
                }
            }
            
            double moyenneClasse = nombreSoumissionsAvecScore > 0 ? sommeScores / nombreSoumissionsAvecScore : 0.0;
            
            Map<String, Object> classeStats = new HashMap<>();
            classeStats.put("classeId", classe.getId());
            classeStats.put("classeNom", classe.getNom());
            classeStats.put("nombreSoumissions", nombreSoumissions);
            classeStats.put("moyenne", Math.round(moyenneClasse * 100.0) / 100.0);
            
            statsParClasse.add(classeStats);
        }
        stats.put("statsParClasse", statsParClasse);

        return stats;
    }

    // Statistiques pour un étudiant
    @GetMapping("/etudiants/{etudiantId}")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> getStudentStatistics(@PathVariable Long etudiantId) {
        // Récupérer toutes les soumissions de l'étudiant avec relations
        List<SoumissionExamen> allSoumissions = soumissionExamenRepository.findAll();
        List<SoumissionExamen> soumissions = allSoumissions.stream()
                .filter(s -> s.getEtudiant() != null && s.getEtudiant().getId().equals(etudiantId))
                .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("nombreExamensPasses", soumissions.size());
        
        if (soumissions.isEmpty()) {
            stats.put("moyenneGlobale", 0.0);
            stats.put("scoreTotal", 0.0);
            stats.put("meilleurScore", 0.0);
            stats.put("statsParExamen", new ArrayList<>());
            return stats;
        }

        // Calculer les statistiques globales
        double moyenneGlobale = soumissions.stream()
                .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                .average()
                .orElse(0.0);
        
        double meilleurScore = soumissions.stream()
                .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                .max()
                .orElse(0.0);
        
        double scoreTotal = soumissions.stream()
                .mapToDouble(s -> s.getScoreTotal() != null ? s.getScoreTotal() : 0.0)
                .sum();

        stats.put("moyenneGlobale", Math.round(moyenneGlobale * 100.0) / 100.0);
        stats.put("meilleurScore", meilleurScore);
        stats.put("scoreTotal", Math.round(scoreTotal * 100.0) / 100.0);

        // Statistiques par examen - charger les examens avec leurs questions
        List<Map<String, Object>> statsParExamen = new ArrayList<>();
        for (SoumissionExamen soumission : soumissions) {
            Examen examen = soumission.getExamen();
            if (examen != null) {
                // Charger l'examen avec ses questions pour éviter LazyInitializationException
                Optional<Examen> examenAvecQuestions = examenRepository.findByIdWithQuestions(examen.getId());
                if (examenAvecQuestions.isPresent()) {
                    Examen exam = examenAvecQuestions.get();
                    
                    Map<String, Object> examStats = new HashMap<>();
                    examStats.put("examenId", exam.getId());
                    examStats.put("examenTitre", exam.getTitre());
                    examStats.put("score", soumission.getScoreTotal() != null ? soumission.getScoreTotal() : 0.0);
                    
                    // Les questions sont maintenant chargées
                    double totalPoints = exam.getQuestions().stream()
                            .mapToDouble(q -> q.getBareme() != null ? q.getBareme() : 0.0)
                            .sum();
                    
                    double pourcentage = totalPoints > 0 ? ((soumission.getScoreTotal() != null ? soumission.getScoreTotal() : 0.0) / totalPoints) * 100 : 0;
                    examStats.put("pourcentage", Math.round(pourcentage * 100.0) / 100.0);
                    examStats.put("totalPoints", totalPoints);
                    examStats.put("dateSoumission", soumission.getSubmittedAt());
                    
                    statsParExamen.add(examStats);
                }
            }
        }
        stats.put("statsParExamen", statsParExamen);

        return stats;
    }

    // Statistiques globales pour l'admin
    @GetMapping("/admin")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> getAdminStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Statistiques globales
        long totalUtilisateurs = utilisateurRepository.count();
        long totalEtudiants = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.ETUDIANT)
                .count();
        long totalProfesseurs = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.PROFESSEUR)
                .count();
        long totalAdmins = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.ADMIN)
                .count();
        
        long totalClasses = classeRepository.count();
        long totalExamens = examenRepository.count();
        long totalSoumissions = soumissionExamenRepository.count();
        
        stats.put("totalUtilisateurs", totalUtilisateurs);
        stats.put("totalEtudiants", totalEtudiants);
        stats.put("totalProfesseurs", totalProfesseurs);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalClasses", totalClasses);
        stats.put("totalExamens", totalExamens);
        stats.put("totalSoumissions", totalSoumissions);
        
        // Distribution des rôles (pour graphique camembert)
        Map<String, Long> distributionRoles = new HashMap<>();
        distributionRoles.put("Étudiants", totalEtudiants);
        distributionRoles.put("Professeurs", totalProfesseurs);
        distributionRoles.put("Admins", totalAdmins);
        stats.put("distributionRoles", distributionRoles);
        
        // Statistiques par classe
        List<Map<String, Object>> statsParClasse = new ArrayList<>();
        List<Classe> toutesClasses = classeRepository.findAll();
        
        for (Classe classe : toutesClasses) {
            // Charger la classe avec ses étudiants pour éviter lazy loading
            Optional<Classe> classeAvecEtudiants = classeRepository.findByIdWithEtudiants(classe.getId());
            long nombreEtudiants = 0;
            if (classeAvecEtudiants.isPresent()) {
                nombreEtudiants = classeAvecEtudiants.get().getEtudiants() != null ? 
                    classeAvecEtudiants.get().getEtudiants().size() : 0;
            }
            
            List<Examen> examensClasse = examenRepository.findByClasseId(classe.getId());
            
            int nombreSoumissions = 0;
            double sommeScores = 0.0;
            int nombreSoumissionsAvecScore = 0;
            
            for (Examen examen : examensClasse) {
                List<SoumissionExamen> soumissions = soumissionExamenRepository.findByExamenIdWithRelations(examen.getId())
                        .stream()
                        .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                        .collect(Collectors.toList());
                
                nombreSoumissions += soumissions.size();
                
                for (SoumissionExamen s : soumissions) {
                    if (s.getScoreTotal() != null) {
                        sommeScores += s.getScoreTotal();
                        nombreSoumissionsAvecScore++;
                    }
                }
            }
            
            double moyenneClasse = nombreSoumissionsAvecScore > 0 ? sommeScores / nombreSoumissionsAvecScore : 0.0;
            
            Map<String, Object> classeStats = new HashMap<>();
            classeStats.put("classeId", classe.getId());
            classeStats.put("classeNom", classe.getNom());
            classeStats.put("nombreEtudiants", nombreEtudiants);
            classeStats.put("nombreExamens", examensClasse.size());
            classeStats.put("nombreSoumissions", nombreSoumissions);
            classeStats.put("moyenne", Math.round(moyenneClasse * 100.0) / 100.0);
            
            statsParClasse.add(classeStats);
        }
        stats.put("statsParClasse", statsParClasse);
        
        // Statistiques par professeur
        List<Map<String, Object>> statsParProfesseur = new ArrayList<>();
        List<Utilisateur> professeurs = utilisateurRepository.findAll().stream()
                .filter(u -> u.getRole() == Utilisateur.Role.PROFESSEUR)
                .collect(Collectors.toList());
        
        for (Utilisateur professeur : professeurs) {
            List<Examen> examensProf = examenRepository.findAll().stream()
                    .filter(e -> e.getProfesseur() != null && e.getProfesseur().getId().equals(professeur.getId()))
                    .collect(Collectors.toList());
            
            int nombreSoumissions = 0;
            for (Examen examen : examensProf) {
                nombreSoumissions += soumissionExamenRepository.findByExamenIdWithRelations(examen.getId())
                        .stream()
                        .filter(s -> s.getStatut() == SoumissionExamen.Statut.PUBLIE)
                        .count();
            }
            
            Map<String, Object> profStats = new HashMap<>();
            profStats.put("professeurId", professeur.getId());
            profStats.put("professeurNom", professeur.getNom());
            profStats.put("nombreExamens", examensProf.size());
            profStats.put("nombreSoumissions", nombreSoumissions);
            
            statsParProfesseur.add(profStats);
        }
        stats.put("statsParProfesseur", statsParProfesseur);
        
        return stats;
    }
}


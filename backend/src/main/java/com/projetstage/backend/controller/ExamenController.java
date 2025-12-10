package com.projetstage.backend.controller;

import com.projetstage.backend.model.Classe;
import com.projetstage.backend.model.Examen;
import com.projetstage.backend.model.Utilisateur;
import com.projetstage.backend.repository.ClasseRepository;
import com.projetstage.backend.repository.ExamenRepository;
import com.projetstage.backend.repository.UtilisateurRepository;
import com.projetstage.backend.repository.ReponseRepository;
import com.projetstage.backend.dto.ExamenDTO;
import com.projetstage.backend.dto.ExamenDetailsDTO;
import com.projetstage.backend.dto.QuestionDTO;
import com.projetstage.backend.dto.ClasseDTO;
import com.projetstage.backend.dto.CreateExamenRequest;
import com.projetstage.backend.dto.CreateQuestionDTO;
import com.projetstage.backend.dto.SubmitExamResponsesDTO;
import com.projetstage.backend.dto.SubmitQuestionResponseDTO;
import com.projetstage.backend.dto.ReponseDTO;
import com.projetstage.backend.dto.CorrectionDTO;
import com.projetstage.backend.dto.SoumissionExamenDTO;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import com.projetstage.backend.dto.CreateQuestionRequestDTO;
import com.projetstage.backend.dto.ExamenDetailsQuestionsDTO;
import com.projetstage.backend.model.Question;
import com.projetstage.backend.model.Reponse;
import com.projetstage.backend.model.SoumissionExamen;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/examens")
@CrossOrigin(origins = "*")
public class ExamenController {

    private final ExamenRepository examenRepository;
    private final ClasseRepository classRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ReponseRepository reponseRepository;
    private final com.projetstage.backend.repository.SoumissionExamenRepository soumissionExamenRepository;

    public ExamenController(ExamenRepository examenRepository, ClasseRepository classRepository,
                            UtilisateurRepository utilisateurRepository, ReponseRepository reponseRepository,
                            com.projetstage.backend.repository.SoumissionExamenRepository soumissionExamenRepository) {
        this.examenRepository = examenRepository;
        this.classRepository = classRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.reponseRepository = reponseRepository;
        this.soumissionExamenRepository = soumissionExamenRepository;
    }

    // Méthode utilitaire pour gérer les doublons : retourne la soumission la plus récente
    private SoumissionExamen getOrCreateSoumission(Long examId, Long etudiantId, Examen examen, Utilisateur etudiant) {
        List<SoumissionExamen> soumissions = soumissionExamenRepository.findByExamenIdAndEtudiantId(examId, etudiantId);
        
        if (soumissions.isEmpty()) {
            // Créer une nouvelle soumission
            SoumissionExamen s = new SoumissionExamen();
            s.setExamen(examen);
            s.setEtudiant(etudiant);
            s.setStatut(SoumissionExamen.Statut.EN_COURS);
            s.setCreatedAt(LocalDateTime.now());
            return soumissionExamenRepository.save(s);
        }
        
        // Si plusieurs soumissions existent, prendre la plus récente
        // Supprimer les anciennes si nécessaire (optionnel, pour nettoyer)
        SoumissionExamen soumission = soumissions.stream()
                .sorted((s1, s2) -> {
                    if (s1.getCreatedAt() == null && s2.getCreatedAt() == null) return 0;
                    if (s1.getCreatedAt() == null) return 1;
                    if (s2.getCreatedAt() == null) return -1;
                    return s2.getCreatedAt().compareTo(s1.getCreatedAt());
                })
                .findFirst()
                .orElse(soumissions.get(0));
        
        // Supprimer les doublons (garder seulement la plus récente)
        if (soumissions.size() > 1) {
            for (int i = 1; i < soumissions.size(); i++) {
                SoumissionExamen duplicate = soumissions.get(i);
                if (!duplicate.getId().equals(soumission.getId())) {
                    soumissionExamenRepository.delete(duplicate);
                }
            }
        }
        
        return soumission;
    }

    @GetMapping
    public List<ExamenDTO> getAll() {
        // Retourne TOUS les examens (pour les professeurs/admins)
        // Pas de filtre par dates - les profs doivent voir tous leurs examens
        return examenRepository.findAll()
                .stream()
                .map(ExamenDTO::new)
                .toList();
    }
    
    @GetMapping("/professeur/{professeurId}")
    public List<ExamenDTO> getByProfesseur(@PathVariable Long professeurId) {
        // Retourne tous les examens d'un professeur (sans filtre de dates)
        return examenRepository.findAll()
                .stream()
                .filter(examen -> examen.getProfesseur().getId().equals(professeurId))
                .map(ExamenDTO::new)
                .toList();
    }

    @GetMapping("/afficher")
    public List<ExamenDTO> getAfficherExams() {
        LocalDateTime maintenant = LocalDateTime.now();
        return examenRepository.findByAfficherTrue()
                .stream()
                .filter(examen -> {
                    // L'examen est visible si :
                    // 1. Il est marqué comme afficher
                    // 2. La date de début est passée ou nulle
                    // 3. La date de fin n'est pas encore passée ou nulle
                    boolean debutOk = examen.getDateDebut() == null || !maintenant.isBefore(examen.getDateDebut());
                    boolean finOk = examen.getDateFin() == null || !maintenant.isAfter(examen.getDateFin());
                    return debutOk && finOk;
                })
                .map(ExamenDTO::new)
                .toList();
    }


    @GetMapping("/classe/{classeId}")
    public List<ExamenDTO> getByClasse(@PathVariable Long classeId) {
        LocalDateTime maintenant = LocalDateTime.now();
        return examenRepository.findByClasseId(classeId)
                .stream()
                .filter(examen -> {
                    // L'examen est visible si :
                    // 1. Il est marqué comme afficher
                    // 2. La date de début est passée ou nulle
                    // 3. La date de fin n'est pas encore passée ou nulle
                    if (!examen.isAfficher()) return false;
                    boolean debutOk = examen.getDateDebut() == null || !maintenant.isBefore(examen.getDateDebut());
                    boolean finOk = examen.getDateFin() == null || !maintenant.isAfter(examen.getDateFin());
                    return debutOk && finOk;
                })
                .map(ExamenDTO::new)
                .toList();
    }

    @PostMapping
    public ExamenDetailsDTO create(@RequestBody CreateExamenRequest request) {
        Utilisateur professeur = utilisateurRepository.findById(request.getProfesseurId())
            .orElseThrow(() -> new RuntimeException("Professeur not found"));

        Classe classe = classRepository.findById(request.getClasseId())
            .orElseThrow(() -> new RuntimeException("Classe not found"));

        Examen examen = new Examen();
        examen.setTitre(request.getTitre());
        examen.setDescription(request.getDescription());
        examen.setDuree(request.getDuree());
        examen.setAfficher(request.isAfficher());
        examen.setDatePublication(LocalDateTime.now());
        examen.setDateDebut(request.getDateDebut());
        examen.setDateFin(request.getDateFin());
        examen.setProfesseur(professeur);
        examen.setClasse(classe);

        Examen saved = examenRepository.save(examen);

        return new ExamenDetailsDTO(saved.getId(), saved.getTitre(), saved.getDescription(),
            saved.getDuree(), saved.isAfficher(), saved.getDatePublication(),
            saved.getProfesseur().getNom());
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        examenRepository.deleteById(id);
    }


    @GetMapping("/{id}")
    public ExamenDTO getById(@PathVariable Long id) {
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen non trouvée"));

        return new ExamenDTO(examen);
    }

    @GetMapping("/{id}/details")
public ExamenDetailsQuestionsDTO getExamWithQuestions(@PathVariable Long id) {

    Examen examen = examenRepository.findByIdWithQuestions(id)
            .orElseThrow(() -> new RuntimeException("Examen not found"));

    List<QuestionDTO> q = examen.getQuestions()
                                .stream()
                                .map(QuestionDTO::new)
                                .toList();

    return new ExamenDetailsQuestionsDTO(examen, q);
}


//     @PostMapping("/{examId}/questions")
// public QuestionDTO addQuestion(
//         @PathVariable Long examId,
//         @RequestBody CreateQuestionRequestDTO req
// ) {
//     Examen examen = examenRepository.findById(examId)
//             .orElseThrow(() -> new RuntimeException("Examen not found"));

//     Question q = new Question();
//     q.setTitre(req.getTitre());
//     q.setType(Question.Type.valueOf(req.getType())); // must match enum
//     q.setChoix(req.getChoix());
//     q.setCorrect(req.getCorrect());

//     examen.addQuestion(q);
//     examenRepository.save(examen); // cascades question

//     return new QuestionDTO(q);
// }


    @PostMapping("/{id}/questions")
    @Transactional
    public QuestionDTO addQuestion(
            @PathVariable Long id,
            @RequestBody CreateQuestionDTO dto
    ) {
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen not found"));

        // Validations simples pour éviter les 500
        if (dto.getType() == null || dto.getType().isBlank()) {
            throw new RuntimeException("Type de question manquant (TEXT, MULTIPLE, TRUE_FALSE)");
        }
        if (dto.getTitre() == null || dto.getTitre().isBlank()) {
            throw new RuntimeException("Titre de question manquant");
        }
        Question.Type type;
        try {
            type = Question.Type.valueOf(dto.getType().trim());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Type de question invalide : " + dto.getType());
        }
        if ((type == Question.Type.MULTIPLE || type == Question.Type.TRUE_FALSE)
                && (dto.getChoix() == null || dto.getChoix().isBlank())) {
            throw new RuntimeException("Les options (choix) sont obligatoires pour ce type de question");
        }
        if (dto.getCorrect() == null || dto.getCorrect().isBlank()) {
            throw new RuntimeException("La réponse correcte est obligatoire");
        }

        Question q = new Question();
        q.setType(type);
        q.setTitre(dto.getTitre());
        // on renseigne contenu avec le titre pour compat DB
        q.setContenu(dto.getTitre());
        q.setChoix(dto.getChoix());
        q.setCorrect(dto.getCorrect());
        q.setBareme(dto.getBareme() != null ? dto.getBareme() : 1.0);

        examen.addQuestion(q);
        examenRepository.save(examen);

        return new QuestionDTO(q);
    }

    // --- Autosave brouillon (sauvegarde partielle, statut EN_COURS) ---
    @PatchMapping("/{examId}/soumissions/brouillon")
    @Transactional
    public Map<String, Object> saveBrouillon(
            @PathVariable Long examId,
            @RequestBody SubmitExamResponsesDTO payload
    ) {
        Examen examen = examenRepository.findByIdWithQuestions(examId)
                .orElseThrow(() -> new RuntimeException("Examen not found"));

        var etudiant = utilisateurRepository.findById(payload.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Etudiant not found"));

        SoumissionExamen soumission = getOrCreateSoumission(examId, payload.getEtudiantId(), examen, etudiant);

        // Si startedAt n'est pas défini, l'initialiser maintenant
        if (soumission.getStartedAt() == null) {
            soumission.setStartedAt(LocalDateTime.now());
            soumissionExamenRepository.save(soumission);
        }

        // Verrouillage : on ne peut modifier que si EN_COURS
        if (soumission.getStatut() != SoumissionExamen.Statut.EN_COURS) {
            throw new RuntimeException("Impossible de modifier une soumission déjà finalisée");
        }

        // Vérifier si le temps est écoulé
        if (soumission.getStartedAt() != null) {
            LocalDateTime finExamen = soumission.getStartedAt().plusMinutes(examen.getDuree());
            if (LocalDateTime.now().isAfter(finExamen)) {
                throw new RuntimeException("Le temps imparti pour cet examen est écoulé");
            }
        }

        // Sauvegarde des réponses sans correction (brouillon)
        Map<Long, Question> questionMap = examen.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        for (SubmitQuestionResponseDTO r : payload.getResponses()) {
            Question q = questionMap.get(r.getQuestionId());
            if (q == null) continue;

            Reponse rep = reponseRepository.findBySoumissionIdAndQuestionId(soumission.getId(), q.getId())
                    .orElseGet(Reponse::new);

            rep.setSoumission(soumission);
            rep.setExamen(examen);
            rep.setQuestion(q);
            rep.setEtudiant(etudiant);
            rep.setReponse(r.getReponse());
            // Pas de note ni statut pour le brouillon
            rep.setNote(null);
            rep.setStatut(null);

            reponseRepository.save(rep);
        }

        soumissionExamenRepository.save(soumission);

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Brouillon sauvegardé");
        resp.put("soumissionId", soumission.getId());
        return resp;
    }

    // --- Soumission finale des réponses par l'étudiant ---
    @PostMapping("/{examId}/soumissions")
    @Transactional
    public Map<String, Object> submitResponses(
            @PathVariable Long examId,
            @RequestBody SubmitExamResponsesDTO payload
    ) {
        Examen examen = examenRepository.findByIdWithQuestions(examId)
                .orElseThrow(() -> new RuntimeException("Examen not found"));

        var etudiant = utilisateurRepository.findById(payload.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Etudiant not found"));

        SoumissionExamen soumission = getOrCreateSoumission(examId, payload.getEtudiantId(), examen, etudiant);

        // Si startedAt n'est pas défini, l'initialiser maintenant
        if (soumission.getStartedAt() == null) {
            soumission.setStartedAt(LocalDateTime.now());
            soumissionExamenRepository.save(soumission);
        }

        // Verrouillage strict : on ne peut soumettre que si EN_COURS
        if (soumission.getStatut() != SoumissionExamen.Statut.EN_COURS) {
            throw new RuntimeException("Soumission déjà finalisée. Statut actuel: " + soumission.getStatut());
        }

        // Vérifier si le temps est écoulé
        if (soumission.getStartedAt() != null) {
            LocalDateTime finExamen = soumission.getStartedAt().plusMinutes(examen.getDuree());
            if (LocalDateTime.now().isAfter(finExamen)) {
                throw new RuntimeException("Le temps imparti pour cet examen est écoulé");
            }
        }

        Map<Long, Question> questionMap = examen.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        double scoreAuto = 0.0;
        double scoreManuel = soumission.getScoreManuel() != null ? soumission.getScoreManuel() : 0.0;
        double totalAutoMax = 0.0; // Total des points max pour les questions auto
        boolean hasTextToCorrect = false;

        for (SubmitQuestionResponseDTO r : payload.getResponses()) {
            Question q = questionMap.get(r.getQuestionId());
            if (q == null) continue;

            Reponse rep = reponseRepository.findBySoumissionIdAndQuestionId(soumission.getId(), q.getId())
                    .orElseGet(Reponse::new);

            rep.setSoumission(soumission);
            rep.setExamen(examen);
            rep.setQuestion(q);
            rep.setEtudiant(etudiant);
            rep.setReponse(r.getReponse() != null ? r.getReponse() : "");

            if (q.getType() == Question.Type.TEXT) {
                rep.setStatut(Reponse.Statut.A_CORRIGER);
                rep.setNote(null);
                hasTextToCorrect = true;
            } else {
                // Calcul du total max pour les questions auto
                totalAutoMax += (q.getBareme() != null ? q.getBareme() : 1.0);
                
                // Correction automatique
                boolean ok = q.getCorrect() != null && 
                             r.getReponse() != null &&
                             q.getCorrect().trim().equalsIgnoreCase(r.getReponse().trim());
                double pts = ok ? (q.getBareme() != null ? q.getBareme() : 1.0) : 0.0;
                rep.setNote(pts);
                rep.setStatut(Reponse.Statut.AUTO_CORRIGE);
                scoreAuto += pts;
            }

            reponseRepository.save(rep);
        }

        soumission.setScoreAuto(scoreAuto);
        soumission.setScoreTotal(scoreAuto + scoreManuel);
        soumission.setStatut(hasTextToCorrect ? SoumissionExamen.Statut.SOUMIS : SoumissionExamen.Statut.CORRIGE);
        soumission.setSubmittedAt(LocalDateTime.now());
        soumissionExamenRepository.save(soumission);

        Map<String, Object> resp = new HashMap<>();
        resp.put("scoreAuto", scoreAuto);
        resp.put("totalAutoMax", totalAutoMax); // Total des points max pour les questions auto
        resp.put("examenId", examen.getId());
        resp.put("etudiantId", etudiant.getId());
        resp.put("soumissionId", soumission.getId());
        resp.put("statut", soumission.getStatut().name());
        return resp;
    }

    // Liste des soumissions (vue prof)
    @GetMapping("/{examId}/soumissions")
    public List<SoumissionExamenDTO> getSoumissions(@PathVariable Long examId) {
        return soumissionExamenRepository.findByExamenIdWithRelations(examId)
                .stream()
                .map(SoumissionExamenDTO::new)
                .toList();
    }

    // Démarrer un examen (initialiser startedAt)
    @PostMapping("/{examId}/start")
    @Transactional
    public Map<String, Object> startExam(@PathVariable Long examId, @RequestParam Long etudiantId) {
        try {
            Examen examen = examenRepository.findById(examId)
                    .orElseThrow(() -> new RuntimeException("Examen non trouvé"));
            
            LocalDateTime maintenant = LocalDateTime.now();
            
            // Vérifier que l'examen est dans la période autorisée
            if (examen.getDateDebut() != null && maintenant.isBefore(examen.getDateDebut())) {
                throw new RuntimeException("L'examen n'a pas encore commencé. Date de début : " + examen.getDateDebut());
            }
            
            if (examen.getDateFin() != null && maintenant.isAfter(examen.getDateFin())) {
                throw new RuntimeException("L'examen est terminé. Date de fin : " + examen.getDateFin());
            }
            
            var etudiant = utilisateurRepository.findById(etudiantId)
                    .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

            SoumissionExamen soumission = getOrCreateSoumission(examId, etudiantId, examen, etudiant);

            // Si l'examen n'a pas encore commencé, initialiser startedAt
            if (soumission.getStartedAt() == null) {
                soumission.setStartedAt(LocalDateTime.now());
                soumissionExamenRepository.save(soumission);
            }

            // Vérifier si le temps est écoulé
            boolean tempsEcoule = false;
            if (soumission.getStartedAt() != null) {
                LocalDateTime finExamen = soumission.getStartedAt().plusMinutes(examen.getDuree());
                tempsEcoule = LocalDateTime.now().isAfter(finExamen);
            }

            Map<String, Object> resp = new HashMap<>();
            resp.put("soumissionId", soumission.getId());
            resp.put("startedAt", soumission.getStartedAt());
            resp.put("dureeMinutes", examen.getDuree());
            resp.put("tempsEcoule", tempsEcoule);
            return resp;
        } catch (Exception e) {
            System.err.println("Erreur dans startExam: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors du démarrage de l'examen: " + e.getMessage(), e);
        }
    }

    // Obtenir le temps restant pour un examen
    @GetMapping("/{examId}/soumissions/me/time")
    public Map<String, Object> getTempsRestant(@PathVariable Long examId, @RequestParam Long etudiantId) {
        try {
            Examen examen = examenRepository.findById(examId)
                    .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

            // Gérer les doublons potentiels : prendre la soumission la plus récente
            List<SoumissionExamen> soumissions = soumissionExamenRepository
                    .findByExamenIdAndEtudiantId(examId, etudiantId);
            SoumissionExamen soumission = soumissions.isEmpty() 
                    ? null 
                    : soumissions.stream()
                            .sorted((s1, s2) -> {
                                if (s1.getCreatedAt() == null && s2.getCreatedAt() == null) return 0;
                                if (s1.getCreatedAt() == null) return 1;
                                if (s2.getCreatedAt() == null) return -1;
                                return s2.getCreatedAt().compareTo(s1.getCreatedAt());
                            })
                            .findFirst()
                            .orElse(soumissions.get(0));

            Map<String, Object> resp = new HashMap<>();
            
            if (soumission == null || soumission.getStartedAt() == null) {
                resp.put("tempsRestantSecondes", null);
                resp.put("tempsEcoule", false);
                resp.put("examenCommence", false);
                return resp;
            }

            LocalDateTime finExamen = soumission.getStartedAt().plusMinutes(examen.getDuree());
            LocalDateTime maintenant = LocalDateTime.now();
            long secondesRestantes = java.time.Duration.between(maintenant, finExamen).getSeconds();
            
            boolean tempsEcoule = secondesRestantes <= 0;
            
            resp.put("tempsRestantSecondes", tempsEcoule ? 0 : secondesRestantes);
            resp.put("tempsEcoule", tempsEcoule);
            resp.put("examenCommence", true);
            resp.put("startedAt", soumission.getStartedAt());
            resp.put("dureeMinutes", examen.getDuree());
            
            return resp;
        } catch (Exception e) {
            System.err.println("Erreur dans getTempsRestant: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> resp = new HashMap<>();
            resp.put("tempsRestantSecondes", null);
            resp.put("tempsEcoule", false);
            resp.put("examenCommence", false);
            resp.put("error", "Erreur lors du calcul du temps restant");
            return resp;
        }
    }

    // Soumission d'un étudiant (vue étudiant)
    @GetMapping("/{examId}/soumissions/me")
    public Map<String, Object> getMySoumission(@PathVariable Long examId, @RequestParam Long etudiantId) {
        try {
            // Gérer les doublons : prendre la soumission la plus récente
            List<SoumissionExamen> soumissionsList = soumissionExamenRepository.findByExamenIdAndEtudiantIdWithRelations(examId, etudiantId);
            SoumissionExamenDTO soum = null;
            if (!soumissionsList.isEmpty()) {
                try {
                    // Prendre la soumission la plus récente
                    SoumissionExamen soumission = soumissionsList.stream()
                            .sorted((s1, s2) -> {
                                if (s1.getCreatedAt() == null && s2.getCreatedAt() == null) return 0;
                                if (s1.getCreatedAt() == null) return 1;
                                if (s2.getCreatedAt() == null) return -1;
                                return s2.getCreatedAt().compareTo(s1.getCreatedAt());
                            })
                            .findFirst()
                            .orElse(soumissionsList.get(0));
                    soum = new SoumissionExamenDTO(soumission);
                } catch (Exception e) {
                    // Log l'erreur mais continue avec soum = null
                    System.err.println("Erreur lors de la création du DTO: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            List<ReponseDTO> reps = List.of();
            if (soum != null && soum.getId() != null) {
                try {
                    reps = reponseRepository.findBySoumissionIdWithRelations(soum.getId())
                            .stream()
                            .map(ReponseDTO::new)
                            .toList();
                } catch (Exception e) {
                    System.err.println("Erreur lors du chargement des réponses: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            Map<String, Object> resp = new HashMap<>();
            resp.put("soumission", soum);
            resp.put("reponses", reps);
            return resp;
        } catch (Exception e) {
            System.err.println("Erreur dans getMySoumission: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la récupération de la soumission: " + e.getMessage(), e);
        }
    }

    // Liste des réponses d'une soumission (vue prof)
    @GetMapping("/soumissions/{soumissionId}/reponses")
    public List<ReponseDTO> getReponsesBySoumission(@PathVariable Long soumissionId) {
        return reponseRepository.findBySoumissionIdWithRelations(soumissionId)
                .stream()
                .map(ReponseDTO::new)
                .toList();
    }

    // Récupérer toutes les réponses d'un examen (compat front existant)
    @GetMapping("/{examId}/soumissions/reponses")
    public List<ReponseDTO> getReponsesByExam(@PathVariable Long examId) {
        return reponseRepository.findByExamenId(examId)
                .stream()
                .map(ReponseDTO::new)
                .toList();
    }

    // Correction manuelle (TEXT)
    @PostMapping("/soumissions/{reponseId}/corriger")
    @Transactional
    public ReponseDTO corriger(
            @PathVariable Long reponseId,
            @RequestBody CorrectionDTO dto
    ) {
        Reponse rep = reponseRepository.findById(reponseId)
                .orElseThrow(() -> new RuntimeException("Réponse non trouvée"));

        rep.setNote(dto.getNote());
        rep.setStatut(Reponse.Statut.CORRIGE_MANUEL);
        reponseRepository.save(rep);

        SoumissionExamen soum = rep.getSoumission();
        if (soum != null) {
            // recalcul manuel + total
            double scoreManuel = reponseRepository.findBySoumissionIdWithRelations(soum.getId()).stream()
                    .filter(x -> x.getStatut() == Reponse.Statut.CORRIGE_MANUEL && x.getNote() != null)
                    .mapToDouble(Reponse::getNote)
                    .sum();
            soum.setScoreManuel(scoreManuel);
            soum.setScoreTotal((soum.getScoreAuto() != null ? soum.getScoreAuto() : 0.0) + scoreManuel);
            
            // Vérifier si toutes les réponses TEXT sont corrigées
            List<Reponse> allReponses = reponseRepository.findBySoumissionIdWithRelations(soum.getId());
            boolean allTextCorrected = allReponses.stream()
                    .filter(r -> r.getQuestion().getType() == Question.Type.TEXT)
                    .allMatch(r -> r.getStatut() == Reponse.Statut.CORRIGE_MANUEL);
            
            // Ne changer le statut que si toutes les réponses TEXT sont corrigées ET que le statut est SOUMIS
            if (allTextCorrected && soum.getStatut() == SoumissionExamen.Statut.SOUMIS) {
                soum.setStatut(SoumissionExamen.Statut.CORRIGE);
                soum.setCorrectedAt(LocalDateTime.now());
            }
            
            soumissionExamenRepository.save(soum);
        }

        return new ReponseDTO(rep);
    }

    // Valider une soumission (passer de SOUMIS à CORRIGE si toutes les réponses sont corrigées)
    @PostMapping("/soumissions/{soumissionId}/valider")
    @Transactional
    public SoumissionExamenDTO validerSoumission(@PathVariable Long soumissionId) {
        SoumissionExamen soum = soumissionExamenRepository.findById(soumissionId)
                .orElseThrow(() -> new RuntimeException("Soumission non trouvée"));

        if (soum.getStatut() != SoumissionExamen.Statut.SOUMIS) {
            throw new RuntimeException("Seules les soumissions SOUMIS peuvent être validées");
        }

        // Vérifier que toutes les réponses TEXT sont corrigées
        List<Reponse> reponses = reponseRepository.findBySoumissionIdWithRelations(soumissionId);
        boolean toutesCorrigees = reponses.stream()
                .allMatch(r -> r.getStatut() != Reponse.Statut.A_CORRIGER);

        if (!toutesCorrigees) {
            throw new RuntimeException("Toutes les réponses ouvertes doivent être corrigées avant validation");
        }

        // Recalculer les scores
        double scoreAuto = reponses.stream()
                .filter(r -> r.getStatut() == Reponse.Statut.AUTO_CORRIGE && r.getNote() != null)
                .mapToDouble(Reponse::getNote)
                .sum();
        double scoreManuel = reponses.stream()
                .filter(r -> r.getStatut() == Reponse.Statut.CORRIGE_MANUEL && r.getNote() != null)
                .mapToDouble(Reponse::getNote)
                .sum();

        soum.setScoreAuto(scoreAuto);
        soum.setScoreManuel(scoreManuel);
        soum.setScoreTotal(scoreAuto + scoreManuel);
        soum.setStatut(SoumissionExamen.Statut.CORRIGE);
        soum.setCorrectedAt(LocalDateTime.now());
        soumissionExamenRepository.save(soum);

        return new SoumissionExamenDTO(soum);
    }

    // Publication des résultats
    @PostMapping("/soumissions/{soumissionId}/publier")
    @Transactional
    public SoumissionExamenDTO publier(@PathVariable Long soumissionId) {
        SoumissionExamen soum = soumissionExamenRepository.findById(soumissionId)
                .orElseThrow(() -> new RuntimeException("Soumission non trouvée"));

        if (soum.getStatut() != SoumissionExamen.Statut.CORRIGE) {
            throw new RuntimeException("La soumission doit être CORRIGE avant publication");
        }

        soum.setStatut(SoumissionExamen.Statut.PUBLIE);
        soum.setPublishedAt(LocalDateTime.now());
        soumissionExamenRepository.save(soum);
        return new SoumissionExamenDTO(soum);
    }

}


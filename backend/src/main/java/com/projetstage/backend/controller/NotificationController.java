package com.projetstage.backend.controller;

import com.projetstage.backend.dto.NotificationDTO;
import com.projetstage.backend.model.Notification;
import com.projetstage.backend.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Récupérer toutes les notifications d'un étudiant
    @GetMapping("/etudiant/{etudiantId}")
    public List<NotificationDTO> getNotificationsByEtudiant(@PathVariable Long etudiantId) {
        return notificationRepository.findByUtilisateurIdOrderByDateCreationDesc(etudiantId)
                .stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }

    // Récupérer les notifications non lues d'un étudiant
    @GetMapping("/etudiant/{etudiantId}/non-lues")
    public List<NotificationDTO> getNotificationsNonLues(@PathVariable Long etudiantId) {
        return notificationRepository.findByUtilisateurIdAndLuFalseOrderByDateCreationDesc(etudiantId)
                .stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }

    // Compter les notifications non lues
    @GetMapping("/etudiant/{etudiantId}/count")
    public Map<String, Object> countNotificationsNonLues(@PathVariable Long etudiantId) {
        long count = notificationRepository.countNonLuesByUtilisateurId(etudiantId);
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return response;
    }

    // Marquer une notification comme lue
    @PutMapping("/{notificationId}/lu")
    public Map<String, Object> marquerCommeLu(@PathVariable Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        notification.setLu(true);
        notificationRepository.save(notification);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification marquée comme lue");
        return response;
    }

    // Marquer toutes les notifications d'un étudiant comme lues
    @PutMapping("/etudiant/{etudiantId}/toutes-lues")
    public Map<String, Object> marquerToutesCommeLues(@PathVariable Long etudiantId) {
        List<Notification> notifications = notificationRepository.findByUtilisateurIdAndLuFalseOrderByDateCreationDesc(etudiantId);
        notifications.forEach(n -> n.setLu(true));
        notificationRepository.saveAll(notifications);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Toutes les notifications ont été marquées comme lues");
        response.put("count", notifications.size());
        return response;
    }

    // Supprimer une notification
    @DeleteMapping("/{notificationId}")
    public Map<String, Object> supprimerNotification(@PathVariable Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        notificationRepository.delete(notification);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification supprimée avec succès");
        return response;
    }
}


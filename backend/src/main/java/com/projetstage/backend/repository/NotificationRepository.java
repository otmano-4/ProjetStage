package com.projetstage.backend.repository;

import com.projetstage.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUtilisateurIdOrderByDateCreationDesc(Long utilisateurId);
    
    List<Notification> findByUtilisateurIdAndLuFalseOrderByDateCreationDesc(Long utilisateurId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.utilisateur.id = :utilisateurId AND n.lu = false")
    long countNonLuesByUtilisateurId(@Param("utilisateurId") Long utilisateurId);
}


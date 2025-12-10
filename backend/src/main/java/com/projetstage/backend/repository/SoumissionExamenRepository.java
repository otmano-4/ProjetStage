package com.projetstage.backend.repository;

import com.projetstage.backend.model.SoumissionExamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SoumissionExamenRepository extends JpaRepository<SoumissionExamen, Long> {
    List<SoumissionExamen> findByExamenId(Long examenId);
    
    @Query("SELECT s FROM SoumissionExamen s JOIN FETCH s.examen JOIN FETCH s.etudiant WHERE s.examen.id = :examenId")
    List<SoumissionExamen> findByExamenIdWithRelations(@Param("examenId") Long examenId);
    
    // Retourner une liste pour gérer les doublons potentiels
    List<SoumissionExamen> findByExamenIdAndEtudiantId(Long examenId, Long etudiantId);
    
    @Query("SELECT s FROM SoumissionExamen s JOIN FETCH s.examen e JOIN FETCH s.etudiant WHERE s.examen.id = :examenId AND s.etudiant.id = :etudiantId ORDER BY s.createdAt DESC")
    List<SoumissionExamen> findByExamenIdAndEtudiantIdWithRelations(@Param("examenId") Long examenId, @Param("etudiantId") Long etudiantId);
}


package com.projetstage.backend.repository;

import com.projetstage.backend.model.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReponseRepository extends JpaRepository<Reponse, Long> {
    List<Reponse> findByExamenId(Long examenId);
    List<Reponse> findByExamenIdAndEtudiantId(Long examenId, Long etudiantId);
    List<Reponse> findBySoumissionId(Long soumissionId);
    
    @Query("SELECT r FROM Reponse r JOIN FETCH r.question JOIN FETCH r.etudiant JOIN FETCH r.soumission WHERE r.soumission.id = :soumissionId")
    List<Reponse> findBySoumissionIdWithRelations(@Param("soumissionId") Long soumissionId);
    
    java.util.Optional<Reponse> findBySoumissionIdAndQuestionId(Long soumissionId, Long questionId);
}


package com.projetstage.backend.repository;

import com.projetstage.backend.model.Examen;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExamenRepository extends JpaRepository<Examen, Long> {
    @EntityGraph(attributePaths = {"professeur"})
    List<Examen> findByAfficherTrue();

    @EntityGraph(attributePaths = {"professeur"})
    List<Examen> findByClasseId(Long classeId);

    @Query("SELECT e FROM Examen e LEFT JOIN FETCH e.questions LEFT JOIN FETCH e.professeur WHERE e.id = :id")
    Examen findWithQuestionsAndProfesseurById(@Param("id") Long id);
}

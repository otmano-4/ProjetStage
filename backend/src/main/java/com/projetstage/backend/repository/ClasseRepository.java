package com.projetstage.backend.repository;

import java.util.Optional;
import java.util.List;

import com.projetstage.backend.model.Classe;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClasseRepository extends JpaRepository<Classe, Long> {
    @EntityGraph(attributePaths = {"etudiants", "professeurs"})
    @Query("SELECT c FROM Classe c WHERE c.id = :id")
    Optional<Classe> findByIdWithEtudiantsAndProfesseurs(@Param("id") Long id);

    @EntityGraph(attributePaths = {"etudiants"})
    @Query("SELECT c FROM Classe c WHERE c.id = :id")
    Optional<Classe> findByIdWithEtudiants(@Param("id") Long id);

    @Query("SELECT c FROM Classe c JOIN c.professeurs p WHERE p.id = :profId")
    List<Classe> findAllByProfesseurId(@Param("profId") Long profId);
}

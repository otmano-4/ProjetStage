package com.projetstage.backend.repository;

import com.projetstage.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    // Ajoute cette méthode pour rechercher un utilisateur par email
    Optional<Utilisateur> findByEmail(String email);
    
    @Query("SELECT c.id FROM Classe c JOIN c.etudiants e WHERE e.id = :etudiantId")
Long findClasseIdByEtudiantId(Long etudiantId);

    
}

package com.projetstage.backend.repository;

import com.projetstage.backend.model.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamenRepository extends JpaRepository<Examen, Long> {
    // 🔹 Custom query method pour récupérer les examens d'une classe
    List<Examen> findByClasseId(Long classeId);
}

package com.projetstage.backend.repository;

import com.projetstage.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}

package com.projetstage.backend.repository;

import com.projetstage.backend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
}

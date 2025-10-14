package com.projetstage.backend.controller;

import com.projetstage.backend.model.Note;
import com.projetstage.backend.repository.NoteRepository;
import com.projetstage.backend.dto.NoteDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {

    private final NoteRepository noteRepository;

    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping
    public List<NoteDTO> getAll() {
        return noteRepository.findAll()
                .stream()
                .map(NoteDTO::new)
                .toList();
    }

    @PostMapping
    public NoteDTO create(@RequestBody Note note) {
        Note saved = noteRepository.save(note);
        return new NoteDTO(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        noteRepository.deleteById(id);
    }
}

package com.projetstage.backend.controller;

import com.projetstage.backend.model.Question;
import com.projetstage.backend.repository.QuestionRepository;
import com.projetstage.backend.dto.QuestionDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping
    public List<QuestionDTO> getAll() {
        return questionRepository.findAll()
                .stream()
                .map(QuestionDTO::new)
                .toList();
    }

    @PostMapping
    public QuestionDTO create(@RequestBody Question question) {
        Question saved = questionRepository.save(question);
        return new QuestionDTO(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        questionRepository.deleteById(id);
    }
}

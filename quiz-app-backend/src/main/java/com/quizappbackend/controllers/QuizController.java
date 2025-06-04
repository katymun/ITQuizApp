package com.quizappbackend.controllers;

import com.quizappbackend.entities.Quiz;
import com.quizappbackend.repositories.QuizRepository;
import com.quizappbackend.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public Page<Quiz> getAll(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "10") int size) {
        return quizService.getAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public Quiz getById(@PathVariable Long id) {
        return quizService.getById(id);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public Quiz create(@RequestBody Quiz quiz) {
        return quizService.create(quiz);
    }

    @PutMapping("/{id}")
    public Quiz update(@PathVariable Long id, @RequestBody Quiz quiz) {
        return quizService.update(id, quiz);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        quizService.delete(id);
    }

    @GetMapping("/filter")
    public Page<Quiz> filterByLevel(@RequestParam(required = false) Integer level,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size) {
        if (level != null) {
            List<Quiz> filtered = quizService.findByLevel(level);
            return new PageImpl<>(filtered, PageRequest.of(page, size), filtered.size());
        }
        return quizService.getAll(PageRequest.of(page, size));
    }
}

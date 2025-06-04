package com.quizappbackend.services;

import com.quizappbackend.entities.Question;
import com.quizappbackend.entities.Quiz;
import com.quizappbackend.repositories.QuestionRepository;
import com.quizappbackend.repositories.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public Page<Quiz> getAll(Pageable pageable) {
        Page<Quiz> quizzes = quizRepository.findAll(pageable);
        return quizzes;
    }

    public Quiz getById(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Quiz not found"));
    }

    public Quiz create(Quiz quiz) {
        if (quiz.getQuestions() != null) {
            for (Question q : quiz.getQuestions()) {
                q.setQuiz(quiz);
            }
        }
        return quizRepository.save(quiz);
    }

    public Quiz update(Long id, Quiz updated) {
        Quiz existing = getById(id);
        existing.setTitle(updated.getTitle());
        return quizRepository.save(existing);
    }

    public void delete(Long id) {
        quizRepository.deleteById(id);
    }

    public List<Quiz> findByLevel(int level) {
        return quizRepository.findByLevel(level);
    }

}
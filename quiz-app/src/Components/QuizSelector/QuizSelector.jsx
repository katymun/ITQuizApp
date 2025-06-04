// src/components/QuizSelector/QuizSelector.js
import React from 'react';
import './QuizSelector.css';

const QuizSelector = ({ quizzes, onSelect }) => {
    const groupByLevel = () => {
        const levels = {};
        quizzes.forEach((quiz) => {
            if (!levels[quiz.level]) levels[quiz.level] = [];
            levels[quiz.level].push(quiz);
        });
        return levels;
    };

    const getUnlockedLevel = () => {
        const levels = groupByLevel();
        const levelNumbers = Object.keys(levels).map(Number).sort((a, b) => a - b);

        for (let i = 0; i < levelNumbers.length; i++) {
            const level = levelNumbers[i];
            const allCompleted = levels[level].every((q) =>
                getSavedScore(q.id) >= q.questions.length * 0.8
            );
            if (!allCompleted) return level;
        }
        return levelNumbers[levelNumbers.length - 1];
    };

    const getSavedScore = (id) => {
        const saved = localStorage.getItem(`quizScore_${id}`);
        return saved ? parseInt(saved, 10) : null;
    };

    const calculateStats = () => {
        let totalQuizzesTaken = 0;
        let totalCorrect = 0;
        let totalQuestions = 0;

        quizzes.forEach((quiz) => {
            const score = getSavedScore(quiz.id);
            if (score != null) {
                totalCorrect += score;
                totalQuizzesTaken++;
                totalQuestions += quiz.questions.length;
            }
        });
        const correctRate =
            totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        return { totalQuizzesTaken, correctRate };
    };

    const levels = groupByLevel();
    const unlockedLevel = getUnlockedLevel();
    const { totalQuizzesTaken, correctRate } = calculateStats();

    return (
        <div className="quiz-selector">
            <h1>Quiz App</h1>
            <div className="stats">
                <p>Total quizzes taken: {totalQuizzesTaken}</p>
                <p>Overall correct answer rate: {correctRate}%</p>
                <p>
                    <strong>Level:</strong> {unlockedLevel}
                </p>
            </div>
            <h2>Select a quiz</h2>
            {Object.keys(levels)
                .sort((a, b) => a - b)
                .map((level) => (
                    <div key={level}>
                        <ul>
                            {levels[level].map((quiz) => {
                                const hasQuestions = Array.isArray(quiz.questions) && quiz.questions.length > 0;
                                const isUnlocked = hasQuestions && parseInt(level) <= unlockedLevel;
                                const savedScore = getSavedScore(quiz.id);
                                return (
                                    <li
                                        key={quiz.id}
                                        className={!isUnlocked ? 'locked' : ''}
                                        onClick={() => isUnlocked && onSelect(quiz)}
                                        style={{
                                            cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                            opacity: isUnlocked ? 1 : 0.5,
                                        }}
                                    >
                                        <p className="quiz-title">{quiz.title}</p>
                                        {savedScore != null && (
                                            <p className="quiz-score">
                                                Last score: {savedScore} of {quiz.questions.length}
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
        </div>
    );
};

export default QuizSelector;
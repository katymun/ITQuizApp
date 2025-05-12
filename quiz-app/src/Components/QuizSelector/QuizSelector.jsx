import React from 'react'
import './QuizSelector.css'

const QuizSelector = ({ quizzes, onSelect }) => {

    const getSavedScore = (id) => {
        const saved = localStorage.getItem(`quizScore_${id}`);
        return saved ? parseInt(saved, 10) : null;
    };

    const calculateStats = () => {
        let totalQuizzesTaken = 0;
        let totalCorrect = 0;
        let totalQuestions = 0;

        quizzes.forEach(quiz => {
            const score = getSavedScore(quiz.id);
            if (score != null) {
                totalCorrect += score;
                totalQuizzesTaken++;
                totalQuestions += quiz.questions.length;
            }
        });

        const correctRate = totalQuestions > 0 ? Math.round((totalCorrect/totalQuestions)*100) : 0;

        return{totalQuizzesTaken, correctRate};
    };

    const { totalQuizzesTaken, correctRate } = calculateStats();

    return (
        <div className="quiz-selector">
            <h1>Quiz App</h1>
            <div className="stats">
                <p>Total quizzes taken: {totalQuizzesTaken}</p>
                <p>Overall correct answer rate: {correctRate}%</p>
            </div>
            <h2>Select a quiz</h2>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id} onClick={() => onSelect(quiz)}>
                        <p>{quiz.title}</p>
                        {getSavedScore(quiz.id) != null ?
                            <>
                                <p>Last score: {getSavedScore(quiz.id)} of {quiz.questions.length}</p>
                            </> :
                            <>
                            </>
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizSelector;
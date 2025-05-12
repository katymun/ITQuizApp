import React, { useState, useRef, useEffect } from 'react'
import './Quiz.css'

const Quiz = ({ quiz, onReset }) => {

    let [index, setIndex] = useState(() => {
        const savedIndex = localStorage.getItem('quizIndex');
        return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
    });
    let [question, setQuestion] = useState(quiz.questions[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(() => {
        const savedScore = localStorage.getItem('quizScore');
        return savedScore !== null ? parseInt(savedScore, 10) : 0;
    });
    let [result, setResult] = useState(() => {
        const savedResult = localStorage.getItem('quizResult');
        return savedResult === 'true'; // convert string to boolean
    });

    useEffect(() => {
        if (result) {
            const quizKey = `quizScore_${quiz.id}`;
            localStorage.setItem(quizKey, score.toString());
        }
    }, [result]);

    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let optionArray = [Option1, Option2, Option3, Option4];

    const checkAnswer = (e, ans) => {
        if (!lock) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                optionArray[question.ans - 1].current.classList.add("correct");
            }
            setLock(true);
        }

    }

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const next = () => {
        if (lock === true) {
            if (index === quiz.questions.length - 1) {
                setResult(true);
                return 0;
            }
            setIndex(++index);
            setQuestion(quiz.questions[index]);
            setLock(false);
            optionArray.map((option) => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
                return null;
            })
        }
    }

    const reset = () => {
        setIndex(0);
        setQuestion(quiz.questions[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        onReset();
    }

    return (
        <div className="container">
            {result ?
                <>
                    <h1>{quiz.title}</h1>
                    <h2>You scored {score} out of {quiz.questions.length}</h2>
                    <button onClick={reset}>Back to quizzes</button>
                </> :
                <>
                    <h1>{index + 1}. {question.question}</h1>
                    <ul>
                        <li ref={Option1} onClick={(e) => { checkAnswer(e, 1) }}>{question.option1}</li>
                        <li ref={Option2} onClick={(e) => { checkAnswer(e, 2) }}>{question.option2}</li>
                        <li ref={Option3} onClick={(e) => { checkAnswer(e, 3) }}>{question.option3}</li>
                        <li ref={Option4} onClick={(e) => { checkAnswer(e, 4) }}>{question.option4}</li>
                    </ul>
                    <button onClick={next}>Next</button>

                    <div className="index">{index + 1} of {quiz.questions.length} questions</div>
                </>
            }

        </div>
    )
}

export default Quiz

import React, { useState, useEffect } from 'react';
import Login from './Components/Login/Login.jsx';
import QuizSelector from './Components/QuizSelector/QuizSelector.jsx';
import Quiz from './Components/Quiz/Quiz.jsx';
import { fetchQuizzes } from './services/api';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setLoading(true);
      setError('');
      fetchQuizzes(0, 10)
          .then((pageData) => {
            setQuizzes(pageData.content);
          })
          .catch((err) => {
            console.error('Failed to fetch quizzes:', err);
            setError(err.message || 'Could not load quizzes');
          })
          .finally(() => {
            setLoading(false);
          });
    }
  }, [user]);

  if (!user) {
    return (
        <Login
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
            }}
        />
    );
  }

  return (
      <div>
        {/* Simple Logout button */}
        <div className="logout-button-div">
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }}
                className="logout-button"
            >
                Logout
            </button>
        </div>

        {selectedQuiz ? (
            <Quiz quiz={selectedQuiz} onReset={() => setSelectedQuiz(null)} />
        ) : (
            <>
              {loading && <p>Loading quizzes...</p>}
              {error && <p className="error">{error}</p>}
              {!loading && !error && (
                  <QuizSelector quizzes={quizzes} onSelect={setSelectedQuiz} />
              )}
            </>
        )}
      </div>
  );
};

export default App;
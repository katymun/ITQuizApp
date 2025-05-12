import React, { useState } from 'react'
import Quiz from './Components/Quiz/Quiz'
import QuizSelector from './Components/QuizSelector/QuizSelector';
import {quizList} from './assets/data'

const App = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return(
    <div>
      {selectedQuiz ? (
        <Quiz quiz={selectedQuiz} onReset={() => setSelectedQuiz(null)} />
      ) : (
        <QuizSelector quizzes={quizList} onSelect={setSelectedQuiz}/>
      )}
    </div>
  );
};

export default App

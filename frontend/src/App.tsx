import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // const [savedName, setSavedName] = useState('Guest');
  // const [inputName, setInputName] = useState('');
  const [isSubmitted] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [] = useState([]);

  const [inputAnswer, setInputAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState<{ answer: string; percentage: number; }[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  const fetchFromBackend = () =>
    fetch('/api/questions/random')
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setCurrentQuestion(data.text)
        setCurrentQuestionId(data.id)
      })

  const sendAnswerToBackend = () =>
    fetch(`/api/questions/${currentQuestionId}/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: inputAnswer
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.correct) {
          const alreadyFound = correctAnswers.some(obj => {
            return obj.answer.toLowerCase() === inputAnswer.toLowerCase();
          });

          if (!alreadyFound) 
            setCorrectAnswers(prev => [...prev, {answer: inputAnswer, percentage: data.percentage}]);
        } else {
          setWrongAnswers(prev => [...prev, ` ${inputAnswer}`]);
        }
      })

  useEffect(()=>{
    fetchFromBackend()
  }, [])

  return (
    <>
      <h1>94%</h1>

      {/* Hello, {savedName}! <br></br>

      {!isSubmitted && (
        <>
          <label>
            <input name="myInput" placeholder="My name is.." onChange={e => setInputName(e.target.value)}/>
          </label>
          <button onClick={() => {
            setSavedName(inputName)
            setIsSubmitted(true)
          }}>
            OK
          </button>
        </>
      )} */}

      {isSubmitted && (
        <>
          <div>Can you guess the most popular answers?<br></br></div>
          <div style={{ 
            textAlign: 'center',
            margin: '50px auto',
            maxWidth: '800px',
            paddingTop: '40px'
          }}>
            <div style={{
              fontSize: '80px',
              color: '#D4A574',
              marginBottom: '20px',
              lineHeight: '0.5'
            }}>
              ❝
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: '350',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              {currentQuestion}
            </div>
          </div>
          {correctAnswers.length > 0 && (
            <div style={{ whiteSpace: 'pre-line' }} className="answer-bubble">
              <div className="answer-bubble-text">
                <br />
                {correctAnswers
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((obj, i) => (
                    <div key={i}>{obj.answer} {obj.percentage}%</div>
                  ))}              
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '40px' }}>
            <input 
              name="myInput" 
              placeholder="Type your answer..."
              onChange={e => setInputAnswer(e.target.value)}
            /> 
            <button onClick={() => {
              sendAnswerToBackend()
            }}>
              Submit
            </button>
          </div>
          <div style={{
            paddingTop: '20px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '14px'
          }} > Wrong Answers: {wrongAnswers} </div>
        </>
      )}
      
      <footer className="footer">
        <p>© 2025 Sam Lee</p>
      </footer>
    </>
  )
}

export default App

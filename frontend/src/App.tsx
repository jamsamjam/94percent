import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // const [savedName, setSavedName] = useState('Guest');
  // const [inputName, setInputName] = useState('');
  const [isSubmitted] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  // const [] = useState([]); TODO: seen questions
  const [hasGivenUp, setHasGivenUp] = useState(false);

  const [inputAnswer, setInputAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState<{ answer: string; percentage: number; }[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [isShaking, setIsShaking] = useState(false);

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
            return obj.answer.toLowerCase() === data.answer.toLowerCase();
          });

          if (!alreadyFound) 
            setCorrectAnswers(prev => [...prev, {answer: data.answer, percentage: data.percentage}]);
        } else {
          setWrongAnswers(prev => [...prev, inputAnswer]);
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      })

  const revealAnswers = () =>
    fetch(`/api/questions/${currentQuestionId}/answers`)
      .then(res => res.json())
      .then(data => {
        setCorrectAnswers(data.answers);
      });

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

          {!hasGivenUp && (
            <>
              {correctAnswers.length > 0 && (
                <div style={{ whiteSpace: 'pre-line' }} className="answer-bubble">
                  <div className="answer-bubble-text">
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
                  value={inputAnswer}
                  onChange={e => setInputAnswer(e.target.value)}
                  className={isShaking ? 'shake' : ''}
                /> 
                <button onClick={() => {
                  sendAnswerToBackend()
                  setInputAnswer('')
                }}>
                  Submit
                </button>
              </div>
            </>
          )}

          {hasGivenUp && (
            <>
              <div style={{ whiteSpace: 'pre-line' }} className="answer-bubble">
                <div className="answer-bubble-text">
                  {correctAnswers
                    .sort((a, b) => b.percentage - a.percentage)
                    .map((obj, i) => (
                      <div key={i}>{obj.answer} {obj.percentage}%</div>
                    ))}              
                </div>
              </div>
              <button onClick={() => {
                setHasGivenUp(false);
                setCorrectAnswers([]);
                setWrongAnswers([]);
                setInputAnswer('');
                fetchFromBackend();
              }}>
                Next Question
              </button>
            </>
          )}

          <div style={{
            paddingTop: '20px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '14px'
          }} > Wrong Answers: {wrongAnswers.join(", ")} </div>
          {!hasGivenUp && (<button className="text-button" onClick={() => {
            setHasGivenUp(true)
            revealAnswers()
          }}>
            I give up
          </button>
          )}
        </>
      )}
      
      <footer className="footer">
        <p>© 2025 <a style={{ color: 'rgba(255, 255, 255, 0.5)' }} href="https://github.com/jamsamjam/94percent">Sam Lee</a></p>
      </footer>
    </>
  )
}

export default App

import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // const [savedName, setSavedName] = useState('Guest');
  // const [inputName, setInputName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [used, setUsed] = useState([]);
  const [inputAnswer, setInputAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState<{ answer: string; percentage: number; }[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  const fetchFromBackend = () =>
    fetch('http://localhost:5147/api/questions/random')
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
    fetch(`http://localhost:5147/api/questions/${currentQuestionId}/guess`, {
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
            padding: '40px'
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
          <div>
            <input name="myInput" onChange={e => setInputAnswer(e.target.value)}/> 
            <button style={{
              color: '#D4A574'
            }} onClick={() => {
              sendAnswerToBackend()
            }}>
              Submit
            </button>
          </div>
          
          <div> So far we've got: {correctAnswers
            .sort((a, b) => b.percentage - a.percentage)
            .map(obj =>
              `${obj.answer} (${obj.percentage}%)`).join(', ')}
          </div>
          <div> Wrong answers: {wrongAnswers} </div>
        </>
      )}
    </>
  )
}

export default App

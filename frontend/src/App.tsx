import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [savedName, setSavedName] = useState('Guest');
  const [inputName, setInputName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [used, setUsed] = useState([]);
  const [inputAnswer, setInputAnswer] = useState('');
  const [savedAnswer, setSavedAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
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
          setCorrectAnswers(prev => [...prev, `${inputAnswer} (${data.percentage}%)`]);
        } else {
          setWrongAnswers(prev => [...prev, inputAnswer]);
        }
      })

  useEffect(()=>{
    fetchFromBackend()
  }, [])

  return (
    <>
      <h1>94%</h1>
      Hello, {savedName}! <br></br>

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
      )}

      {isSubmitted && (
        <>
          <div> Guess the most popular answers :) <br></br> </div>
          <div style={{
            height: '150px',
            width: '550px',
            borderColor: 'gray',
            borderWidth: 'initial',
            borderStyle: 'solid'
          }}>
            {currentQuestion} <br></br>
            <input name="myInput" onChange={e => setInputAnswer(e.target.value)}/> 
            <button onClick={() => {
              setSavedAnswer(inputAnswer)
              sendAnswerToBackend()
            }}>
              Submit
            </button>
          </div>
          <div> So far we've got: {correctAnswers} </div>
          <div> Wrong answers: {wrongAnswers} </div>
        </>
      )}
    </>
  )
}

export default App

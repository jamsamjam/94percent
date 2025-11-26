import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [savedName, setSavedName] = useState('Guest');
  const [inputName, setInputName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState('');

  const getQuestionFromBackend = () => {
    setCurrentQuestion("test")
  }

  fetch('http://localhost:5147/api/questions/random')
    .then((response) => {
      response.json().then()
      setCurrentQuestion(response)
    })

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
        <div> Guess the most popular answers :) <br></br> </div>
      )}

    </>
  )
}

export default App

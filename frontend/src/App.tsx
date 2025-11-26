import { useState } from 'react'
import './App.css'

function App() {
  const [savedName, setSavedName] = useState('Guest');
  const [inputName, setInputName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      <h1>94%</h1>
      Hello, {savedName}! <br></br>
      Guess the most popular answers :) <br></br>

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

      
    </>
  )
}

export default App

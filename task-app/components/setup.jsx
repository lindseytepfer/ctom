import React, {useState} from 'react';

export const Setup = ( { setPairID, setSubjectID, setRound, pageEvent} ) => {

  const [start, setStart] = useState(false);

  const handleStart = () => {
    setStart(true);
  }

  return (
    <div className='setup'>
      { !start &&
        <div>
          <p>Please enter the the following information: </p>
          <form>
          <label>Pair number:</label>
          <input onChange={ (e) => setPairID(e.target.value) }></input>

          <label>Subject number:</label>
          <input onChange={ (e) => setSubjectID(e.target.value) }></input>

          <label>Round number (optional):</label>
          <input onChange={ (e) => setRound(e.target.value ) }></input>
          </form>

          <button className='buttons' onClick={handleStart}>Submit</button>
      </div>
      }

      { start &&
      <div>
        <p>Press the button below when you are ready to start!</p>
        <button className='buttons' onClick={pageEvent}>Begin Study</button>
      </div>

      }
    </div>

  )
}
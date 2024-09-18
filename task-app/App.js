import React, { useState, useEffect } from 'react';
import './App.css';
import { Setup } from './components/setup';
import { Experiment } from './components/experiment';

function App() {
  const [data, setData] = useState(null);
  const [pairID, setPairID] = useState(null); //room is our pair variable
  const [subjectID, setSubjectID] = useState(null);
  const [roundState, setRoundState] = useState(0);

  const [pageEvent, setPageEvent] = useState(0);

  useEffect(() => {
    import(`../public/trialOrders/pair-${pairID}.json`)
      .then((module) => {
        // Access the JSON data from the imported module
        const x = module.default;
        setData(x);
      })
      .catch((error) => {
        console.error('Error loading JSON file:', error);
      });
  }, [pairID]);


  const nextPage = () => {
    setPageEvent( (prev) => prev +1 );
  }

  return (
    <div className="App">
        {(() => {
            switch (pageEvent) {
                case 0:
                    return <Setup setPairID={setPairID} setSubjectID={setSubjectID} setRoundState={setRoundState} pageEvent={nextPage}  />
                case 1: 
                    return <Experiment pairID={pairID} subjectID={subjectID} roundState={roundState} setRoundState={setRoundState} data={data} />
                default:
                    return null;
            }
        })()}
    </div>
);
}

export default App;

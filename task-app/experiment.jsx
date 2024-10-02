import React, { useState, useEffect, useRef } from 'react';
import { TraitRatings } from './traitRatings';
import { StateRatings } from './stateRatings';
import { SurpriseRatings } from './surpriseRatings';
import { AgreeRatings } from './agreeRatings';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase-config'

export const Experiment = ( { roundState, setRoundState, subjectID, pairID, data } ) => {

  const stimList = ["faceTrait", "faceState","videoTrial","videoTrait", "videoState","partnerPredict","convoSync",
    "convoTrial","convoTrait","convoState","partnerSurprise","partnerAgree","roundSync"]; // 13 items
  const roundList = [];
  const targetList = [];
  const traitList = [];

  for (let rd in data) {
  let r = [];
  roundList.push(rd)
  for (let target in data[rd]) {
    targetList.push(target)
    for (let stimuli in data[rd][target]){
      for (let rating in data[rd][target][stimuli]){
        r.push(rating)
      }
    }
  }
  r.push("surprise", "agree")
  traitList.push(r)
  }

  const durations = {'target1':192060.0,'target2':87640.0,'target3':176300.0,'target4':96230.0,'target5':142530.0,
           'target6':60400.0,'target7':193320.0,'target8':63000.0,'target9':170240.0,'target10':147150.0}

  // HANDLE RESPONSE COLLECTION
  const [targetState,setTargetState] = useState(roundState);
  const [stimState, setStimState] = useState(0);
  const [traitState,setTraitState] = useState(0); 
  const [rating, setRating] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // TRACK RESPONSE REACTIONS
  const [ST, setST] = useState(0); // (stimulus) start time
  const [TT, setTT] = useState(0) // trait start time
  const [RT, setRT] = useState(0); // reaction time

  // HANDLE STIMULI PRESENTATION
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  //REALTIME CONNECTION
  const [connects, setConnects] = useState([]);

  //IMAGE AND VIDEO VARIABLES
  let targetImg = `stimuli/${targetList[targetState]}/photo.png`;
  let targetVid = `stimuli/${targetList[targetState]}/video.mp4`;

  //CONNECTION DATABSE
  const connectionsRef = collection(db, "connections");

  const sendConnectionData = async (e) => {
    try {
      await addDoc(connectionsRef, {
          pairID: pairID,
          subjectID: subjectID,
          round: roundState,
          stim: stimList[stimState]
      });
    } catch (err) {
      console.log(err);
    }
  }

  //RESPONSE DATABASE
  const dataCollectionRef = collection(db, "responses");

  const sendData = async () => {
      try {
          await addDoc(dataCollectionRef, {
              pairID: pairID,
              subjectID: subjectID,
              round:roundList[roundState],
              target:targetList[targetState],
              stim:stimList[stimState],
              trait:traitList[roundState][traitState],
              rating:rating,
              ST:ST,
              TT:TT,
              RT:RT,
      });
      } catch (err) {
          console.error(err)
      }
  }

  const queryDB = () => {
    const queryConnections = query(connectionsRef, where("pairID", "==", pairID), where("round", "==", roundState), where("stim", "==", stimList[stimState]) )

    const unsubscribe = onSnapshot( queryConnections, ( snapshot ) => {
        snapshot.forEach((doc) =>{
            let connects = []
            snapshot.forEach( (doc) => {
                connects.push(doc.data()['stim'] )
            })
            setConnects(connects)
        })
    } )
    return () => unsubscribe(); 
  }

  // COLLECTING RESPONSE DATA
  const handleChange = (e) => {
    setRating(e.target.value);
  };

  const pushStim = () => {
    setStimState((prev) => prev+1)
  }

  useEffect(()=>{
    setST(Date.now());
  }, [stimState])
  
  useEffect(()=>{
    setTT(Date.now());
  }, [traitState])

  useEffect(()=>{
    if (stimState === 2 || stimState === 6 || stimState === 7 || stimState === 12){
      setSkipped(false);
    } else {
      if (rating === 0) {
        setSkipped(true)
      } else {
        setSkipped(false)
      }
    }
  },[rating])

  // Prevent video skipping!:

  useEffect(()=>{
    if (stimState === 2) {
      setHideButton(true);

      const timer = setTimeout(()=>{
        setHideButton(false)
      }, [durations[targetList[targetState]]])

      return () => clearTimeout(timer)
    }
  }, [stimState])

  // ADVANCING TO THE NEXT ROUND
  const advanceRound = () => {
    setRoundState((prev) => prev + 1); // can't operate on a different round, for some reason. 
    setTargetState((prev) => prev + 1);
    setStimState(0);
    setTraitState(0);
    setRating(0);
    setReady(false);
    setSkipped(true);
  }

  // HANDLE STIMULI PRESENTATION

  const advanceStim = () => {
      setRT(Date.now() - TT);
      sendData();
      setSkipped(true);
      setRating(0);
      pushStim();
      if (stimState === 10){
        setTraitState((prev) => prev + 1);
      }
  }

  const handleTrait = () => { 
    setRT(Date.now() - TT);
    sendData();
    setRating(0)
    setTraitState((prev) => prev + 1);
    setProgress((prev) => prev + 1);

    if (progress === 2){
      pushStim();
      setProgress(0);
      setRating(0)
    }
  }

  const handleContinue = () => {
    if (stimState === 2) {advanceStim();}
    else if (stimState === 6) {pushStim();} // convoSync
    else if (stimState === 7) {pushStim();} //convoTrial
    else if (stimState === 10) {advanceStim();}
    else if (stimState === 11) {advanceStim();}
    else if (stimState === 12) {advanceRound();}
    else {handleTrait();}
  }

  // CHECKING TO SEE IF BOTH PARTNERS ARE READY
  const intervalIdRef = useRef(null);

  const startInterval = () => {
    if (connects.length < 2 && !intervalIdRef.current) {
      intervalIdRef.current = setInterval(() => {
        console.log("Querying database ...");
        queryDB();
      }, 2000);
    }
  };

  const stopInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  useEffect(() => {
    if (connects.length >= 2) {
      stopInterval(); // Stop the interval if the condition is met
    }
    // Cleanup on unmount
    return () => stopInterval();
  }, [connects.length]);

  useEffect(()=>{
    if (stimState === 6) { //convoSync
      sendConnectionData();
      startInterval();
    } if (stimState === 12) { //roundSync
      sendConnectionData();
      startInterval();
    }
  }, [stimState] )

  // Listen to the output of the DB query to proceed once both partners are ready.
  useEffect(()=>{
    if (connects.length >= 2) {
      setConnects([]);
      if (stimState === 6){
        pushStim()
      } else {
        setReady(true);
      }
    }
  },[connects])

  console.log("Stimstate:", stimState, "->", stimList[stimState],"\n",
   "roundState:", roundState, "->", roundList[roundState],"\n",
   "targetState:", targetState, "->", targetList[targetState],"\n",
   "traitState:", traitState, "->", traitList[roundState][traitState],"\n",
   "rating:", rating, "skipped:", skipped, "progress:", progress, "\n")
  
  return (
    <div className='experiment'>
      {stimList[stimState] === "faceTrait" && 
        <>
            <p>How would you rate this person on the following trait?</p>
            <img src={targetImg} alt="" width='30%' />
            <TraitRatings traitlist={traitList} round={roundState} traitstate={traitState} rating={rating} handleChange={handleChange} />
        </>
      }
      
      {stimList[stimState] === "faceState" && 
        <>
          <p>How would you rate this person on the following state? </p>
          <img src={targetImg} alt="" width='30%'/>
          <StateRatings traitlist={traitList} round={roundState} traitstate={traitState} rating={rating} handleChange={handleChange} />
        </>
      }

      {stimList[stimState] === "videoTrial" && 
        <div className='vidDiv'>
          <p>Please watch the following video: </p>
          <video src={targetVid} width="640" height="360" autoPlay>Unable to load video.</video>
        </div>
      }
      
      {stimList[stimState] === "videoTrait" &&
        <>
          <p>After watching the video, how would you rate this person on the following trait? </p>
          <img src={targetImg} alt="" width='30%'/>
          <TraitRatings traitlist={traitList} round={roundState} traitstate={traitState} rating={rating} handleChange={handleChange} />
        </>
      }

      {stimList[stimState] === "videoState" &&
        <>
          <p>After watching the video, how would you rate this person on the following state? </p>
          <img src={targetImg} alt="" width='30%' />
          <StateRatings traitlist={traitList} round={roundState} traitstate={traitState} rating={rating} handleChange={handleChange} />
        </>
      }

      {stimList[stimState] === "partnerPredict" && 
        <>
          <p>After watching the video, how do you think <span className='partnerText'>your partner</span> would rate this person on the following trait? </p>
          <img src={targetImg} alt="" width='30%'/>
          <p className='partnerText'>Heads up! These are questions about what you think *your partner's* impressions were!</p>
          <TraitRatings traitlist={traitList} round={roundState} traitstate={traitState} rating={rating} handleChange={handleChange} />
        </>
      }

      {stimList[stimState] === "convoSync" && 
        <>
          <p>Waiting for your partner ...</p>
        </>
      }

      {stimList[stimState] === "convoTrial" &&
        <>
          <p>Please take a moment to discuss your impressions of this person with your partner!</p>
          <img src={targetImg} alt="" width='30%'/>
          <p>When you are done talking, press the button below to move on.</p>
        </>
      }

      {stimList[stimState] === "convoTrait" &&  //8 can't render because it's STATE traitings, but why? 
        <>
          <p>After discussing this person with your partner, how would you rate this person on the following trait?</p>
          <img src={targetImg} alt="" width='30%'/>
          <TraitRatings traitlist={traitList} round={roundState} traitstate={traitState} rating={rating} handleChange={handleChange} />
        </>
      }

      {stimList[stimState] === "convoState" && 
        <>
          <p>After discussing this person with your partner, how would you rate this person on the following state?</p>
          <img src={targetImg} alt="" width='30%'/>
          <StateRatings traitlist={traitList} round={roundState} traitstate={traitState} rating={rating} handleChange={handleChange} />
        </>
      }

      {stimList[stimState] === "partnerSurprise" && 
        <>
          <p>Were you surprised by your partner's impressions of this person?</p>
          <img src={targetImg} alt="" width='30%'/>
          <SurpriseRatings rating={rating} handleChange={handleChange}/>
        </>
      }

      {stimList[stimState] === "partnerAgree" && 
        <>
          <p>How much did you agree with your partner's impression of this person?</p>
          <img src={targetImg} alt="" width='30%'/>
          <AgreeRatings rating={rating} handleChange={handleChange}/>
        </>
      }

      {stimList[stimState] === "roundSync" && roundState !== 9 &&
        <>
          <p> Round {parseInt(roundState) + 1 }/ 10 is complete!</p>
          <p>When your partner is ready, a button will appear. Click it to start the next round.</p>
        </>
      }

      {roundState !==9 && stimState !==6 && !skipped && stimState !==12 && !hideButton &&
        <>
          <button className='buttons' onClick={handleContinue}>Continue</button>
        </>
      }

      {stimState ===12 && ready &&
        <>
          <button className='buttons' onClick={handleContinue}>Continue</button>
        </>
      }

      {stimList[stimState] === "roundSync" && roundState === 9 &&
        <>
            <p>You have completed the study.</p>
            <p>The researcher will be with you shortly.</p>
        </>
      }

  </div>
  )
}
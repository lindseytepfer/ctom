import React from 'react';
import { Grid, Typography, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio} from "@mui/material";

export const StateRatings = ( props ) => {

    return (
        <>
            <Grid container justifyContent="center" paddingTop={2} paddingBottom={5}>
            <Typography style={{color: "rgb(33,37,40)"}} align="center">
                {
                    props.traitlist[props.round][props.traitstate] === "Valence" && 
                    <>  
                        <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"><span style={{color: '#000000', fontSize: 30}}>{props.traitlist[props.round][props.traitstate]}</span></FormLabel>
                        <p className='definitions'>(states that are characterized by how pleasant & agreeable or unpleasant & disagreeable they are.)</p>
                            <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" value={props.rating} onChange={props.handleChange}>
                                <FormLabel labelPlacement="start" style={{fontSize: 20}}>Negative <p>(e.g., distress,<br/> terror, guilt, despair)</p></FormLabel>
                                <FormControlLabel value="1" control={<Radio />} label="1" labelPlacement='bottom'/>
                                <FormControlLabel value="2" control={<Radio />} label="2" labelPlacement='bottom'/>
                                <FormControlLabel value="3" control={<Radio />} label="3" labelPlacement='bottom'/>
                                <FormControlLabel value="4" control={<Radio />} label="4" labelPlacement='bottom'/>
                                <FormControlLabel value="5" control={<Radio />} label="5" labelPlacement='bottom'/>
                                <FormControlLabel value="6" control={<Radio />} label="6" labelPlacement='bottom'/>
                                <FormControlLabel value="7" control={<Radio />} label="7" labelPlacement='bottom'/>
                                <FormLabel labelPlacement="end" style={{fontSize: 20}}>Positive <p>(e.g., affection, pleasure, <br/>excitement, delight)</p></FormLabel>
                            </RadioGroup>
                        </FormControl>
                    </>
                }

                {
                    props.traitlist[props.round][props.traitstate] === "Impact" &&
                    <>  
                        <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"><span style={{color: '#000000', fontSize: 30}}>Social {props.traitlist[props.round][props.traitstate]}</span></FormLabel>
                        <p className='definitions'> (E.g., how a person's state relates to others; the impact this state may have on other people.)</p>
                            <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" value={props.rating} onChange={props.handleChange}>
                                <FormLabel labelPlacement="start" style={{fontSize: 20}}>Low <p>(e.g., tired, bored,<br/> lonely, gloomy)</p></FormLabel>
                                <FormControlLabel value="1" control={<Radio />} label="1" labelPlacement='bottom'/>
                                <FormControlLabel value="2" control={<Radio />} label="2" labelPlacement='bottom'/>
                                <FormControlLabel value="3" control={<Radio />} label="3" labelPlacement='bottom'/>
                                <FormControlLabel value="4" control={<Radio />} label="4" labelPlacement='bottom'/>
                                <FormControlLabel value="5" control={<Radio />} label="5" labelPlacement='bottom'/>
                                <FormControlLabel value="6" control={<Radio />} label="6" labelPlacement='bottom'/>
                                <FormControlLabel value="7" control={<Radio />} label="7" labelPlacement='bottom'/>
                                <FormLabel labelPlacement="end" style={{fontSize: 20}}>High <p>(e.g., excited, outraged, <br/>humorous, affection)</p></FormLabel>
                            </RadioGroup>
                        </FormControl>
                    </>
                }

                {
                    props.traitlist[props.round][props.traitstate] === "Rationality" && 
                    <>  
                        <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"><span style={{color: '#000000', fontSize: 30}}>{props.traitlist[props.round][props.traitstate]}</span></FormLabel>
                        <p className='definitions'>States of feeling; emotional states.</p>
                            <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" value={props.rating} onChange={props.handleChange}>
                                <FormLabel labelPlacement="start" style={{fontSize: 20}}>Emotional</FormLabel>
                                <FormControlLabel value="1" control={<Radio />} label="1" labelPlacement='bottom'/>
                                <FormControlLabel value="2" control={<Radio />} label="2" labelPlacement='bottom'/>
                                <FormControlLabel value="3" control={<Radio />} label="3" labelPlacement='bottom'/>
                                <FormControlLabel value="4" control={<Radio />} label="4" labelPlacement='bottom'/>
                                <FormControlLabel value="5" control={<Radio />} label="5" labelPlacement='bottom'/>
                                <FormControlLabel value="6" control={<Radio />} label="6" labelPlacement='bottom'/>
                                <FormControlLabel value="7" control={<Radio />} label="7" labelPlacement='bottom'/>
                                <FormLabel labelPlacement="end" style={{fontSize: 20}}>Rational</FormLabel>
                            </RadioGroup>
                        </FormControl>
                    </>
                }

            </Typography>
            </Grid>
        </>
    )
}
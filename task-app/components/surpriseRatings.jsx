import React from 'react';
import { Grid, Typography, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@mui/material";

export const SurpriseRatings = ( props ) => {
    return (
        <>
            <Grid container justifyContent="center" paddingTop={2} paddingBottom={5}>
            <Typography style={{color: "rgb(33,37,40)"}} align="center">
            <FormControl>
                <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" value={props.rating} onChange={props.handleChange}>
                    <FormLabel labelPlacement="start" style={{fontSize: 20}}>Not surprised at all</FormLabel>
                    <FormControlLabel value="1" control={<Radio />} label="1" labelPlacement='bottom'/>
                    <FormControlLabel value="2" control={<Radio />} label="2" labelPlacement='bottom'/>
                    <FormControlLabel value="3" control={<Radio />} label="3" labelPlacement='bottom'/>
                    <FormControlLabel value="4" control={<Radio />} label="4" labelPlacement='bottom'/>
                    <FormControlLabel value="5" control={<Radio />} label="5" labelPlacement='bottom'/>
                    <FormControlLabel value="6" control={<Radio />} label="6" labelPlacement='bottom'/>
                    <FormControlLabel value="7" control={<Radio />} label="7" labelPlacement='bottom'/>
                    <FormLabel labelPlacement="end" style={{fontSize: 20}}>Very surprised</FormLabel>
                </RadioGroup>
            </FormControl>
            </Typography>
            </Grid>
        </>
    )
}
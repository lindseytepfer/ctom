import React from 'react';
import { RadioGroup, FormControl, FormLabel, FormControlLabel, Radio} from "@mui/material";

export const AgreeRatings = ( props ) => {
    return (
        <>
            <FormControl>
                <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" value={props.rating} onChange={props.handleChange}>
                    <FormLabel labelPlacement="start">Did not agree at all</FormLabel>
                    <FormControlLabel value="1" control={<Radio />} label="1" labelPlacement='bottom'/>
                    <FormControlLabel value="2" control={<Radio />} label="2" labelPlacement='bottom'/>
                    <FormControlLabel value="3" control={<Radio />} label="3" labelPlacement='bottom'/>
                    <FormControlLabel value="4" control={<Radio />} label="4" labelPlacement='bottom'/>
                    <FormControlLabel value="5" control={<Radio />} label="5" labelPlacement='bottom'/>
                    <FormControlLabel value="6" control={<Radio />} label="6" labelPlacement='bottom'/>
                    <FormControlLabel value="7" control={<Radio />} label="7" labelPlacement='bottom'/>
                    <FormLabel labelPlacement="end">Completely agreed</FormLabel>
                </RadioGroup>
            </FormControl>
        </>
    )
}
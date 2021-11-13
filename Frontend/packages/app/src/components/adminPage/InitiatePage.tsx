import { TextField, Card, CardMedia, CardContent, Button} from '@material-ui/core';
import React from 'react';

type InitiatePageProps = {
    init: () => void,
    initialStake: () => void,
}

export const InitiatePage = ({init, initialStake}: InitiatePageProps) => {


    return (
        <Card >
            <CardMedia
                component="img"
                height="500"
                image="Klee_6.jpeg"
                alt="green iguana"
            />
            <CardContent>
                <Button variant="contained" onClick={() => {init()}}>Initiate App</Button>
                <br/>
                <br/>
                <Button variant="contained" onClick={() => {initialStake()}}>Initial Stake</Button>
            </CardContent>
        </Card>
    );
}
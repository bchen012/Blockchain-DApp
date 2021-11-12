import { TextField, Card, CardMedia, CardContent, Button} from '@material-ui/core';
import React, { useState } from 'react';

type ExchangeServiceProps = {
    setExchange: (amount: string) => void
}

export const SetExchangeRate = ({setExchange}: ExchangeServiceProps) => {

    const [exchangeRate, setExchangeRate] = useState<string>('');


    return (
        <Card >
            <CardMedia
                component="img"
                height="500"
                image="Klee_6.jpeg"
                alt="green iguana"
            />
            <CardContent>
                <div>

                    <TextField
                        required
                        id="outlined-required"
                        label="Exchange Rate"
                        value={exchangeRate}
                        fullWidth
                        autoComplete={"off"}
                        onChange={(e) => setExchangeRate(e.target.value)}
                    />
                </div>
                <br/>
                <Button variant="contained" onClick={() => {setExchange(exchangeRate)}}>Set</Button>
            </CardContent>
        </Card>
    );
}
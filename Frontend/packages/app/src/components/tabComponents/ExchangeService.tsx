import { TextField, Card, CardMedia, CardContent, Button} from '@material-ui/core';
import React, { useState } from 'react';

type ExchangeServiceProps = {
    transfer: (targetAddress: string, amount: string) => void
}

export const ExchangeService = ({transfer}: ExchangeServiceProps) => {

    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');


    return (
        <Card >
            <CardMedia
                component="img"
                height="500"
                image="Klee_3.jpeg"
                alt="green iguana"
            />
            <CardContent>
                <div>
                    <h2>Transfer KV2 to:</h2>
                    <TextField
                        required
                        id="outlined-required"
                        label="Target Address"
                        defaultValue=""
                        value={address}
                        autoComplete={"off"}
                        fullWidth
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <br/>
                    <TextField
                        required
                        id="outlined-required"
                        label="Amount"
                        autoComplete={"off"}
                        value={amount}
                        fullWidth
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <br/>
                <Button variant="contained" onClick={() => {
                    transfer(address, amount)
                    setAddress('')
                    setAmount('')
                }}>Transfer</Button>
            </CardContent>
        </Card>
    );
}
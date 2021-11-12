import { TextField, Card, CardMedia, CardContent, Button} from '@material-ui/core';
import React, { useState } from 'react';

type SellServiceProps = {
    sell: (amount: string) => void
    exchangeRate: string
}

export const SellService = ({sell, exchangeRate}: SellServiceProps) => {

    const [amount, setAmount] = useState<string>('');
    const [etherAmount, setEtherAmount]  = useState<string>('0');

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        setEtherAmount(e.target.value / exchangeRate);
    }

    return (
        <Card >
            <CardMedia
                component="img"
                height="500"
                image="Klee_3.jpeg"
                alt="green iguana"
            />
            <CardContent>
                <h2>Enter the amount of KV2 to swap for ETH: </h2>
                <div>
                    <TextField
                        required
                        id="outlined-required"
                        label="Amount"
                        defaultValue=""
                        value={amount}
                        fullWidth
                        autoComplete={"off"}
                        onChange={handleAmountChange}
                    />
                    <br/>
                </div>
                <br/>
                <h2>Eth received: {etherAmount}</h2>
                <Button variant="contained" onClick={() => {
                    sell(amount)
                    setAmount('')
                }}>Transfer</Button>
            </CardContent>
        </Card>
    );
}
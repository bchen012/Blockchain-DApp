import {
    TextField,
    Card,
    CardMedia,
    CardContent,
    Button,
} from '@material-ui/core';
import React, { useState } from 'react';
import MonetizationOnIcon from '@material-ui/icons//MonetizationOn';


type TopUpKv2Props = {
    topUp: (amount: string) => void,
    kv2Balance: string,
    contractBalance: string
}

export const TopUpKv2 = ({topUp, kv2Balance, contractBalance}: TopUpKv2Props) => {

    const [amount, setAmount] = useState<string>('');

    return (
        <div>
            <Card >
                <CardMedia
                    component="img"
                    height="300"
                    image="Klee_3.jpeg"
                />
                <CardContent>
                    <div>
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
                        topUp(amount)
                        setAmount('')
                    }}>Transfer</Button>
                </CardContent>
            </Card>
            <br/>
            <br/>
            <Card >
                <CardContent>
                    <h2>Wallet Amount: {kv2Balance} KV2 <MonetizationOnIcon/></h2>
                    <br/>
                    <h2>Contract Amount: {contractBalance} KV2 <MonetizationOnIcon/></h2>
                </CardContent>
            </Card>
        </div>
    );
}
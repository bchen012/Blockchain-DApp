import {
    TextField,
    Card,
    CardMedia,
    CardContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem, Box
} from '@material-ui/core';
import React, { useState } from 'react';

type ExchangeServiceProps = {
    transfer: (targetAddress: string, amount: string, token: string) => void
}

export const ExchangeService = ({transfer}: ExchangeServiceProps) => {

    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const [token, setToken] = React.useState('YM1');

    return (
        <Card >
            <CardMedia
                component="img"
                height="300"
                image="Klee_3.jpeg"
            />
            <CardContent>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Token</InputLabel>
                        <Select
                            value={token}
                            label="Token"
                            onChange={(e) => {setToken(e.target.value as string)}}
                        >
                            <MenuItem value={'YM1'}>YM1</MenuItem>
                            <MenuItem value={'YM2'}>YM2</MenuItem>
                            <MenuItem value={'ETH'}>ETH</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <div>
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
                    transfer(address, amount, token)
                    setAddress('')
                    setAmount('')
                }}>Transfer</Button>
            </CardContent>
        </Card>
    );
}
import {
    Card,
    CardContent,
    CardMedia,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Box,
    TextField, Button
} from '@material-ui/core';
import React, {useEffect} from 'react';

type EditLiquidityProps = {
    Token_1: string,
    Token_2: string,
    Add: boolean,
    Account: string
    stake_tokens: (token1: string, token2: string, token1Amount: string, token2Amount: string, add: boolean) => void
}
// TODO: Select pool pairs on this page and edit drop down list accordingly

export const EditLiquidity = ({ Token_1, Token_2, Add, Account, stake_tokens }: EditLiquidityProps) => {

    const [token1, setToken1] = React.useState(Token_1);
    const [token2, setToken2] = React.useState(Token_2);
    const [token1Amount, setToken1Amount] = React.useState('');
    const [token2Amount, setToken2Amount] = React.useState('');

    // useEffect(() => {
    //     let isMounted: boolean = true;
    //
    //
    //     return () => { isMounted = false };
    // }, []);


    const handleChange1 = (event: any) => {
        setToken1(event.target.value as string);
    };

    const handleChange2 = (event: any) => {
        setToken2(event.target.value as string);
    };

    return (
        <Card >
            <CardMedia
                component="img"
                height="300"
                image="Klee_1.jpeg"
            />
            <CardContent>
                <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Token 1</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={token1}
                        label="Token 1"
                        onChange={handleChange1}
                    >
                        <MenuItem value={'ETH'}>ETH</MenuItem>
                        <MenuItem value={'YM1'}>YM1</MenuItem>
                        <MenuItem value={'YM2'}>YM2</MenuItem>
                    </Select>
                    <br/>
                    <TextField
                        id="outlined-required"
                        label="Token 1 Amount"
                        value={token1Amount}
                        fullWidth
                        autoComplete={"off"}
                        onChange={(e) => setToken1Amount(e.target.value)}
                    />
                </FormControl>
                </Box>


                <br/>
                <br/>
                <br/>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Token 2</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={token2}
                        label="Token 2"
                        onChange={handleChange2}
                    >
                        <MenuItem value={'ETH'}>ETH</MenuItem>
                        <MenuItem value={'YM1'}>YM1</MenuItem>
                        <MenuItem value={'YM2'}>YM2</MenuItem>
                    </Select>
                    <br/>
                    <TextField
                        id="outlined-required"
                        label="Token 2 Amount"
                        value={token2Amount}
                        fullWidth
                        autoComplete={"off"}
                        onChange={(e) => setToken2Amount(e.target.value)}
                    />
                </FormControl>
                <br/>
                <br/>
                <Button variant="contained" onClick={() => {
                    stake_tokens(token1, token2, token1Amount ?? '0', token2Amount ?? '0', Add)
                }}> {Add ? 'Add':'Remove'} </Button>

            </CardContent>
        </Card>
    );
}
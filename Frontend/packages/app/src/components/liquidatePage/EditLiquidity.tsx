import {
    Card,
    CardContent,
    CardMedia,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Box,
    TextField, Button, Chip
} from '@material-ui/core';
import React from 'react';

type EditLiquidityProps = {
    Token_1: string,
    Token_2: string,
    Add: boolean,
    stake_tokens: (token1: string, token2: string, token1Amount: string, token2Amount: string, add: boolean) => void
}

export const EditLiquidity = ({ Token_1, Token_2, Add, stake_tokens }: EditLiquidityProps) => {

    const [token1, setToken1] = React.useState(Token_1);
    const [token2, setToken2] = React.useState(Token_2);
    const [token1Amount, setToken1Amount] = React.useState('');
    const [token2Amount, setToken2Amount] = React.useState('');

    const [pool, setPool] = React.useState('ETH-YM1');

    // useEffect(() => {
    //     let isMounted: boolean = true;
    //
    //
    //     return () => { isMounted = false };
    // }, []);


    const handleChangePool = (event: any) => {
        const event_val = event.target.value as string;
        setPool(event_val);
        if (event_val === 'ETH-YM1')
            setToken2('YM1')
        else
            setToken2('YM2')
    };

    if (!Add)
        return (
            <Card >
                <CardMedia
                    component="img"
                    height="300"
                    image={Add ? "Klee_1.jpeg": "Klee_3.jpeg"}
                />
                <CardContent>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Liquidity Pool</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={pool}
                                label="Pool"
                                onChange={handleChangePool}
                            >
                                <MenuItem value={'ETH-YM1'}>ETH-YM1</MenuItem>
                                <MenuItem value={'ETH-YM2'}>ETH-YM2</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <br/>
                    <br/>
                    <br/>

                    <Button variant="contained" onClick={() => {
                        stake_tokens(token1, token2, token1Amount ?? '0', token2Amount ?? '0', Add)
                    }}> {Add ? 'Add':'Remove'} </Button>

                </CardContent>
            </Card>
        )

    return (
        <Card >
            <CardMedia
                component="img"
                height="300"
                image={Add ? "Klee_1.jpeg": "Klee_3.jpeg"}
            />
            <CardContent>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Liquidity Pool</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={pool}
                            label="Pool"
                            onChange={handleChangePool}
                        >
                            <MenuItem value={'ETH-YM1'}>ETH-YM1</MenuItem>
                            <MenuItem value={'ETH-YM2'}>ETH-YM2</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <br/>
                <br/>
                <br/>

                <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <h2>{token1}</h2>
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
                    <h2>{token2}</h2>
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
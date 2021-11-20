import { TextField, Card, CardMedia, CardContent, Button} from '@material-ui/core';
import React, { useState } from 'react';
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

type ExchangeServiceProps = {
    setExchange: (id: string, price: string) => void,
    priceRanges: Array<string>
}

export const SetExchangeRate = ({setExchange, priceRanges}: ExchangeServiceProps) => {

    const [exchangeRate, setExchangeRate] = useState<Array<string>>(new Array(priceRanges.length).fill(''));

    const rarityMap = new Map([
        [1, 'common'],
        [2, 'rare'],
        [3, 'legendary'],
        [4, 'mythical']
    ]);
    const rarity_to_color_map = new Map([
        [1, 'mediumseagreen'],
        [2, 'dodgerblue'],
        [3, 'tomato'],
        [4, 'slateblue']
    ]);

    const Prices = priceRanges.map((val, index) => {
        return (
            <div>
                <Card >
                    <CardContent>
                        <h3>Price: {val} KV2 <MonetizationOnIcon/></h3>
                        <h3 style={{color:rarity_to_color_map.get(index+1)}}>{rarityMap.get(index+1)}</h3>
                        <TextField
                            required
                            id="outlined-required"
                            label="Price"
                            value={exchangeRate[index]}
                            fullWidth
                            autoComplete={"off"}
                            onChange={(e) => {
                                let exchange_rate = [...exchangeRate];
                                exchange_rate[index] = e.target.value;
                                setExchangeRate(exchange_rate);
                            }}
                        />
                        <br/>
                        <br/>
                        <Button variant="contained" onClick={()=>{
                            setExchange(String(index), exchangeRate[index]);
                        }}>Set Price</Button>
                    </CardContent>
                </Card>
                <br/>
                <br/>
            </div>
        )
    })

    return (
        <div>
            <Card >
                <CardMedia
                    component="img"
                    height="300"
                    image="Klee_6.jpeg"
                    alt="green iguana"
                />
            </Card>
            {Prices}
        </div>
    );
}
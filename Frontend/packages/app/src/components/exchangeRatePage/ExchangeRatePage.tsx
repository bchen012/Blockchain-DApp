import React, { useState } from 'react';
import Web3 from "web3";
import { KV2_CONTRACT_ADDRESS, KV2_ABI } from "../../config";
import {Card, CardContent, CardMedia, Typography} from "@material-ui/core";
import ExchangeLayout from "./ExchangePageLayout";
import {Content} from '@backstage/core-components';

export const ExchangeRatePage = () => {
    const [exchangeRate, setExchangeRate] = useState<string>('')

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);

    const getExchangeRate = async () => {
        await contract.methods.getExchangeRate().call().then(exr => {
            setExchangeRate(exr);
        });
    }

    getExchangeRate().then();

    return (
        <ExchangeLayout>
            <Content>
            <Card >
                <CardMedia
                    component="img"
                    height="700"
                    image="Klee_22.jpg"
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Exchange Rate
                    </Typography>
                    <Typography variant="h3">
                        1 ETH = {exchangeRate} KV2
                    </Typography>
                </CardContent>
            </Card>
            </Content>
        </ExchangeLayout>
    );
}

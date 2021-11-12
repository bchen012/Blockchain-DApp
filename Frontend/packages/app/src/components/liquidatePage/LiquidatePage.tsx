import LiquidateLayout from "./LiquidateLayout";
import {Content} from '@backstage/core-components';
import Web3 from "web3";
import { KV2_CONTRACT_ADDRESS, KV2_ABI } from "../../config";
import {Button, Card, CardContent, CardMedia, TextField} from "@material-ui/core";
import React, {useState} from "react";

export const LiquidatePage = () => {
    const [buyAmount, setBuyAmount] = useState<string>('0');
    const [etherAmount, setEtherAmount]  = useState<string>('');
    const [exchangeRate, setExchangeRate] = useState<string>('');
    const [account, setAccount] = useState<any>('');

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    web3.eth.getAccounts().then(accounts => {
        setAccount(accounts[0]);
    });

    const getExchangeRate = async () => {
        await contract.methods.getExchangeRate().call().then(exr => {
            setExchangeRate(exr);
        });
    }

    const handleAmountChange = (e) => {
        setEtherAmount(e.target.value);
        setBuyAmount(e.target.value * exchangeRate);
    }

    const buyCoin = async () => {
        await contract.methods.buyCoin()
            .send({from:account, to:KV2_CONTRACT_ADDRESS, value:web3.utils.toWei(etherAmount)})
            .once('receipt', (receipt) => {
                console.log("Transfer success", receipt);
            });
    }

    getExchangeRate().then();

    return (
        <LiquidateLayout >
            <Content>
                <Card >
                    <CardMedia
                        component="img"
                        height="450"
                        image="Klee_8.jpeg"
                        alt="green iguana"
                    />
                    <CardContent>
                        <h2>Enter the amount of Ether you want to swap to KV2:</h2>
                        <div>
                            <TextField
                                required
                                id="outlined-required"
                                label="Amount"
                                defaultValue=""
                                value={etherAmount}
                                fullWidth
                                onChange={handleAmountChange}
                                autoComplete={"off"}
                            />
                            <br/>
                            <h2>To be received: </h2>
                            <h3>
                                {buyAmount} KV2
                            </h3>

                        </div>
                        <br/>
                        <Button variant="contained" onClick={()=>{
                            buyCoin().then(()=>{setEtherAmount('')})
                        }}>Buy</Button>
                    </CardContent>
                </Card>
            </Content>
        </LiquidateLayout>
    );
}

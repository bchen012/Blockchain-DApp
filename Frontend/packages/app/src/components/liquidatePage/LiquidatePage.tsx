import LiquidateLayout from "./LiquidateLayout";
import {Content} from '@backstage/core-components';
import Web3 from "web3";
import {
    KV2_CONTRACT_ADDRESS,
    KV2_ABI,
    K_MINE_ABI,
    K_MINE_CONTRACT_ADDRESS,
    K_REWARD_CONTRACT_ADDRESS,
    YM1_CONTRACT_ADDRESS,
    YM2_CONTRACT_ADDRESS
} from "../../config";

import {Button, Card, CardContent, CardMedia, TextField} from "@material-ui/core";
import React, {useState} from "react";

export const LiquidatePage = () => {
    const [buyAmount, setBuyAmount] = useState<string>('0');
    const [etherAmount, setEtherAmount]  = useState<string>('');
    const [exchangeRate, setExchangeRate] = useState<string>('');
    const [account, setAccount] = useState<any>('');

    const [tokenA_P2, setTokenA_P2] = useState<string>('0');
    const [tokenB_P2, setTokenB_P2] = useState<string>('0');

    const [tokenA_P1, setTokenA_P1] = useState<string>('0');
    const [tokenB_P1, setTokenB_P1] = useState<string>('0');

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    const k_mine_contract = new web3.eth.Contract(K_MINE_ABI, K_MINE_CONTRACT_ADDRESS);

    web3.eth.getAccounts().then(accounts => {
        setAccount(accounts[0]);
    });

    web3.eth.getBalance(K_MINE_CONTRACT_ADDRESS).then(result => {
        console.log('Klee_mine Eth Balance:', result/1e18)
    })

    const getPoolInfo = async () => {
        await k_mine_contract.methods.getPoolInfo(0).call().then(Result => {
            console.log('Pool 0 info:', Result);

            setTokenA_P1(Result[0]/1e18);
            setTokenB_P1(Result[1]/1e18);
        });
        await k_mine_contract.methods.getPoolInfo('1').call().then(Result => {
            setTokenA_P2(Result[0]/1e18)
            setTokenB_P2(Result[1]/1e18)
        });
    };

    getPoolInfo().then();

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
                        <div>
                            <h2>Pool 1 info</h2>
                            <h4>Token A amount: {tokenA_P1}</h4>
                            <h4>Token B amount: {tokenB_P1}</h4>
                            <br/>
                            <h2>Pool 2 info</h2>
                            <h4>Token A amount: {tokenA_P2}</h4>
                            <h4>Token B amount: {tokenB_P2}</h4>
                            <br/>
                        </div>
                        <Button variant="contained" onClick={()=>{
                            buyCoin().then(()=>{setEtherAmount('')})
                        }}>Buy</Button>
                    </CardContent>
                </Card>
            </Content>
        </LiquidateLayout>
    );
}

import { TextField, Card, CardMedia, CardContent, Button} from '@material-ui/core';
import React, { useState } from 'react';
import {K_REWARD_CONTRACT_ADDRESS, YM1_CONTRACT_ADDRESS, YM2_CONTRACT_ADDRESS} from "../../config";

type InitiatePageProps = {
    init: () => void,
    initialStake: () => void,
    tokenA_P1: string,
    tokenB_P1: string,
    tokenA_P2: string,
    tokenB_P2: string,
}

export const InitiatePage = ({init, initialStake, tokenA_P1, tokenB_P1, tokenA_P2, tokenB_P2}: InitiatePageProps) => {


    return (
        <Card >
            <CardMedia
                component="img"
                height="500"
                image="Klee_6.jpeg"
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
                <br/>
                <Button variant="contained" onClick={() => {init()}}>Initiate App</Button>
                <br/>
                <br/>
                <Button variant="contained" onClick={() => {initialStake()}}>Initial Stake</Button>
            </CardContent>
        </Card>
    );
}
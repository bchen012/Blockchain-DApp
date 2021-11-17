import {Button, Card, CardContent, CardMedia, Typography} from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons//MonetizationOn';
import React from 'react';

type RewardsPageProps = {
    balance: string,
    redeemable: string,
    redeem: () => void
}

export const RewardsPage = ({ balance, redeemable, redeem }: RewardsPageProps) => {
    return (
        <Card >
            <CardMedia
                component="img"
                height="400"
                image="Klee_4.jpeg"
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    <br/>
                    Current balance: { balance } KV2 <MonetizationOnIcon/>
                    <br/>
                    Current redeemable: {redeemable} KV2 <MonetizationOnIcon/>
                    <br/>
                    <br/>
                    <Button variant="contained" onClick={()=>{
                        redeem();
                    }}>Redeem</Button>
                </Typography>
            </CardContent>
        </Card>
    );
}
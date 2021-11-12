import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import React from 'react';

type AdminBalanceProps = {
    balance: number
}

export const AdminBalance = ({ balance }: AdminBalanceProps) => {

    return (
        <Card >
            <CardMedia
                component="img"
                height="500"
                image="Klee_4.jpeg"
                alt="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h2" component="div">
                    Account Balance
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                    <br/>
                    Current balance: { balance } ETH
                </Typography>
            </CardContent>
        </Card>
    );
}
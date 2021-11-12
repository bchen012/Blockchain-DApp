import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import React from 'react';

type AccountBalanceProps = {
    account: string,
    balance: number
}

export const AccountBalance = ({ account, balance }: AccountBalanceProps) => {

    return (
        <Card >
            <CardMedia
                component="img"
                height="500"
                image="Klee_1.jpeg"
                alt="green iguana"
            />
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    // align={"center"}
                >
                    Account
                </Typography>
                <Typography
                    gutterBottom
                    variant="caption"
                    component="div"
                    // align={"center"}
                >
                { account }
                </Typography>
                <Typography
                    gutterBottom
                    variant="h3"
                    component="div"
                    // align={"center"}
                >
                    <br/>
                    { balance } KV2
                </Typography>
            </CardContent>
        </Card>
    );
}
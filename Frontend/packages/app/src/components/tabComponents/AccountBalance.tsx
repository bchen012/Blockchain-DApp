import { Card, CardContent } from '@material-ui/core';
import React from 'react';
import NavigationIcon from "@material-ui/icons/Navigation";
import WbCloudyIcon from "@material-ui/icons/WbCloudy";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";

type AccountBalanceProps = {
    ym1_balance: number,
    ym2_balance: number,
    eth_balance: number
}

export const AccountBalance = ({ ym1_balance, ym2_balance, eth_balance }: AccountBalanceProps) => {

    return (
        <div>
            <Card>
                <CardContent>
                    <h3> {ym1_balance} YM1 <WbCloudyIcon /></h3>
                </CardContent>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <h3> {ym2_balance} YM2 <RadioButtonCheckedIcon /></h3>
                </CardContent>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <h3> {eth_balance} ETH <NavigationIcon /></h3>
                </CardContent>
            </Card>
        </div>
    );
}
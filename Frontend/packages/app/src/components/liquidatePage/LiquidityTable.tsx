import {Table, TableColumn} from '@backstage/core-components';
import React, {useEffect, useState} from "react";
import {Typography} from "@material-ui/core";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import NavigationIcon from "@material-ui/icons/Navigation";
import WbCloudyIcon from "@material-ui/icons/WbCloudy";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";

type LiquidityTableProps = {
    k_mine_contract: any,
    account: string
}

type RowData = {
    token_pair: string,
    token_1: string,
    token_2: string,
    total_stake_1: string,
    total_stake_2: string,
    deposit_amount_1: string,
    deposit_amount_2: string,
    token_1_icon: any,
    token_2_icon: any,
}

export const LiquidityTable = ({k_mine_contract, account}: LiquidityTableProps) => {
    const [totalYm1, setTotalYm1] = useState<string>('0');
    const [totalYm2, setTotalYm2] = useState<string>('0');
    const [totalEth, setTotalEth] = useState<string>('0');

    const [tokenA_P1, setTokenA_P1] = useState<string>('0');
    const [tokenB_P1, setTokenB_P1] = useState<string>('0');
    const [tokenA_P2, setTokenA_P2] = useState<string>('0');
    const [tokenB_P2, setTokenB_P2] = useState<string>('0');

    useEffect(() => {
        let isMounted: boolean = true;

        const getPoolInfo = async () => {
            await k_mine_contract.methods.getPoolInfo('0').call().then(Result => {
                if (isMounted) setTotalEth(Result[0]/1e18);
                if (isMounted) setTotalYm1(Result[1]/1e18);
            });
            await k_mine_contract.methods.getPoolInfo('1').call().then(Result => {
                if (isMounted) setTotalYm2(Result[1]/1e18);
            });
        };

        const getUserInfo = async () => {
            await k_mine_contract.methods.getUserStakeInfo('0').call({from: account}).then(Result => {
                if (isMounted) setTokenA_P1(Result[0]/1e18);
                if (isMounted) setTokenB_P1(Result[1]/1e18);
                console.log(Result)
            });

            await k_mine_contract.methods.getUserStakeInfo('1').call({from: account}).then(Result => {
                console.log('USER INFO POOL 2: ', Result);
                if (isMounted) setTokenA_P2(Result[0]/1e18)
                if (isMounted) setTokenB_P2(Result[1]/1e18)
            });
        };

        getPoolInfo().then();
        getUserInfo().then();

        return () => { isMounted = false };
    }, []);



    const columns: TableColumn<RowData>[] = [
        {
            title: 'Pair',
            field: 'token_pair',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <Typography color="textPrimary">
                            {pair.token_1_icon} <SwapHorizIcon /> {pair.token_2_icon} {pair.token_pair}
                        </Typography>
                    </div>
                )
            },
        },
        {
            title: 'Total (Token 1)',
            field: 'total_stake_1',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <Typography color="textPrimary">
                            {pair.total_stake_1} {pair.token_1_icon} {pair.token_1}
                        </Typography>
                    </div>
                )
            },
        },
        {
            title: 'Total (Token 2)',
            field: 'total_stake_2',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <Typography color="textPrimary">
                            {pair.total_stake_2} {pair.token_2_icon} {pair.token_2}
                        </Typography>
                    </div>
                )
            },
        },
        {
            title: 'Staked (Token 1)',
            field: 'deposit_amount_1',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <Typography color="textPrimary">
                            {pair.deposit_amount_1} {pair.token_1_icon} {pair.token_1}
                        </Typography>
                    </div>
                )
            },
        },
        {
            title: 'Staked (Token 2)',
            field: 'deposit_amount_2',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <Typography color="textPrimary">
                            {pair.deposit_amount_2} {pair.token_2_icon} {pair.token_2}
                        </Typography>
                    </div>
                )
            },
        },
        {
            title: 'Pool Share',
            field: '',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <Typography color="textPrimary">
                            {(pair.total_stake_2 === '0') ? '0' :  parseFloat(pair.deposit_amount_2 * 100 / pair.total_stake_2).toFixed(3)} %
                        </Typography>
                    </div>
                )
            },
        },
    ]
    const data: RowData [] = [
        {
            token_pair: 'ETH-YM1',
            total_stake_1: totalEth,
            token_1: 'ETH',
            token_2: 'YM1',
            total_stake_2: totalYm1,
            deposit_amount_1: tokenA_P1,
            deposit_amount_2: tokenB_P1,
            token_1_icon: (<NavigationIcon />),
            token_2_icon: (<WbCloudyIcon />)
        },
        {
            token_pair: 'ETH-YM2',
            total_stake_1: totalEth,
            token_1: 'ETH',
            token_2: 'YM2',
            total_stake_2: totalYm2,
            deposit_amount_1: tokenA_P2,
            deposit_amount_2: tokenB_P2,
            token_1_icon: (<NavigationIcon />),
            token_2_icon: (<RadioButtonCheckedIcon />)
        }
    ]

    return (
        <div>

            <Table<RowData>
                title="Available Pool Pairs"
                options={{
                    search: false,
                    paging: true,
                    pageSize: 20,
                    pageSizeOptions: [20, 50, 100],
                }}
                columns={columns}
                data={data}
            />
        </div>
    )

}
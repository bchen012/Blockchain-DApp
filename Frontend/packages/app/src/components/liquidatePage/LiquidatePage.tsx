import LiquidateLayout from "./LiquidateLayout";
import {Content, Table, TableColumn} from '@backstage/core-components';
import Web3 from "web3";
import {
    K_MINE_ABI,
    K_MINE_CONTRACT_ADDRESS,
    K_REWARD_CONTRACT_ADDRESS,
    YM1_CONTRACT_ADDRESS,
    YM2_CONTRACT_ADDRESS
} from "../../config";
import NavigationIcon from '@material-ui/icons/Navigation';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import WbCloudyIcon from '@material-ui/icons/WbCloudy';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import {Button, TextField, Typography, Box} from "@material-ui/core";
import React, {useState, useRef, useEffect} from "react";

type RowData = {
    token_pair: string,
    token_1: string,
    token_2: string,
    total_stake_1: string,
    total_stake_2: string,
    deposit_amount_1: string,
    deposit_amount_2: string,
    token_1_icon: any,
    token_2_icon: any
}

export const LiquidatePage = () => {
    const [etherAmount, setEtherAmount]  = useState<string>('0');
    const [account, setAccount] = useState<any>('');

    const [tokenA_P1, setTokenA_P1] = useState<string>('0');
    const [tokenB_P1, setTokenB_P1] = useState<string>('0');
    const [tokenA_P2, setTokenA_P2] = useState<string>('0');
    const [tokenB_P2, setTokenB_P2] = useState<string>('0');


    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const k_mine_contract = new web3.eth.Contract(K_MINE_ABI, K_MINE_CONTRACT_ADDRESS);

    // const handleAmountChange = (e) => {
    //     setEtherAmount(e.target.value);
    //     setBuyAmount(e.target.value * exchangeRate);
    // }

    // const buyCoin = async () => {
    //     await contract.methods.buyCoin()
    //         .send({from:account, to:KV2_CONTRACT_ADDRESS, value:web3.utils.toWei(etherAmount)})
    //         .once('receipt', (receipt) => {
    //             console.log("Transfer success", receipt);
    //         });
    // }

    useEffect(() => {
        let isMounted: boolean = true;

        const getPoolInfo = async () => {
            await k_mine_contract.methods.getPoolInfo(0).call().then(Result => {
                console.log('Pool 0 info:', Result);

                if (isMounted) setTokenA_P1(Result[0]/1e18);
                if (isMounted) setTokenB_P1(Result[1]/1e18);
            });
            await k_mine_contract.methods.getPoolInfo('1').call().then(Result => {
                if (isMounted) setTokenA_P2(Result[0]/1e18)
                if (isMounted) setTokenB_P2(Result[1]/1e18)
            });
        };

        web3.eth.getAccounts().then(accounts => {
            if (isMounted) setAccount(accounts[0]);
        });

        web3.eth.getBalance(K_MINE_CONTRACT_ADDRESS).then(result => {
            console.log('Klee_mine Eth Balance:', result/1e18)
            if (isMounted) setEtherAmount(result/1e18);
        })

       getPoolInfo().then();

        return () => { isMounted = false };
    }, []);


    const columns: TableColumn<RowData>[] = [
        {
            title: 'Token Pair',
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
            title: 'Liquidate (Token 1)',
            field: 'deposit_amount_1',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Amount"
                            defaultValue=""
                            value={'0'}
                            fullWidth
                            autoComplete={"off"}
                        />
                        <br/>
                        <Box m={2} pt={3}>
                            <Button variant="contained" endIcon={pair.token_1_icon} onClick={() => {
                            }}>Liquidate </Button>
                        </Box>
                    </div>
                )
            },
        },
        {
            title: 'Liquidate (Token 2)',
            field: 'deposit_amount_2',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                         <TextField
                                required
                                id="outlined-required"
                                label="Amount"
                                defaultValue=""
                                value={'0'}
                                fullWidth
                                autoComplete={"off"}
                            />
                        <br/>
                        <Box m={2} pt={3}>
                        <Button variant="contained" endIcon={pair.token_2_icon} onClick={() => {
                        }}>Liquidate </Button>
                        </Box>
                    </div>
                )
            },
        }
    ]
    const data: RowData [] = [
        {
            token_pair: 'ETH - YM1',
            total_stake_1: etherAmount,
            token_1: 'ETH',
            token_2: 'YM1',
            total_stake_2: '1000',
            deposit_amount_1: tokenA_P1,
            deposit_amount_2: tokenB_P1,
            token_1_icon: (<NavigationIcon />),
            token_2_icon: (<WbCloudyIcon />)
        },
        {
            token_pair: 'ETH - YM2',
            total_stake_1: etherAmount,
            token_1: 'ETH',
            token_2: 'YM2',
            total_stake_2: '1000',
            deposit_amount_1: tokenA_P2,
            deposit_amount_2: tokenB_P2,
            token_1_icon: (<NavigationIcon />),
            token_2_icon: (<RadioButtonCheckedIcon />)
        }
    ]

    return (
        <LiquidateLayout >
            <Content>
                <Table<RowData>
                    title="Liquidity Pools"
                    options={{
                        search: false,
                        paging: true,
                        pageSize: 20,
                        pageSizeOptions: [20, 50, 100],
                    }}
                    columns={columns}
                    data={data}
                />
            </Content>
        </LiquidateLayout>
    );
}

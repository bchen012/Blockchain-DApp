import LiquidateLayout from "./LiquidateLayout";
import {Content, Table, TableColumn} from '@backstage/core-components';
import Web3 from "web3";
import {
    K_MINE_ABI,
    K_MINE_CONTRACT_ADDRESS,
    K_REWARD_CONTRACT_ADDRESS,
    YM1_ABI,
    YM2_ABI,
    YM1_CONTRACT_ADDRESS,
    YM2_CONTRACT_ADDRESS
} from "../../config";
import NavigationIcon from '@material-ui/icons/Navigation';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import WbCloudyIcon from '@material-ui/icons/WbCloudy';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
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
    const [totalYm1, setTotalYm1] = useState<string>('0');
    const [totalYm2, setTotalYm2] = useState<string>('0');

    const [tokenA_P1, setTokenA_P1] = useState<string>('0');
    const [tokenB_P1, setTokenB_P1] = useState<string>('0');
    const [tokenA_P2, setTokenA_P2] = useState<string>('0');
    const [tokenB_P2, setTokenB_P2] = useState<string>('0');


    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const k_mine_contract = new web3.eth.Contract(K_MINE_ABI, K_MINE_CONTRACT_ADDRESS);
    const ym1_contract = new web3.eth.Contract(YM1_ABI, YM1_CONTRACT_ADDRESS);
    const ym2_contract = new web3.eth.Contract(YM2_ABI, YM2_CONTRACT_ADDRESS);

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

        const getTotalYM1 = async () => {
            await ym1_contract.methods.balanceOf(YM1_CONTRACT_ADDRESS).call().then(accountBalance => {
                if (isMounted) setTotalYm1(accountBalance/1e18);
            });
        };

        const getTotalYM2 = async () => {
            await ym2_contract.methods.balanceOf(YM2_CONTRACT_ADDRESS).call().then(accountBalance => {
                if (isMounted) setTotalYm2(accountBalance/1e18);
            });
        };

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
        getTotalYM1().then();
        getTotalYM2().then();

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
            title: 'Add or remove Liquidity',
            field: 'add_or_remove',
            highlight: true,
            cellStyle: {
                width: 500,
                maxWidth: 500
            },
            render: (pair: RowData) => {
                return (
                    <div>
                        <Box m={2} pt={3}>
                            <Button variant="contained" endIcon={<AddIcon />} onClick={() => {
                            }}>Add </Button>
                        </Box>
                        <Box m={2} pt={3}>
                            <Button variant="outlined" endIcon={<RemoveIcon />} onClick={() => {
                            }}>Remove </Button>
                        </Box>
                    </div>
                )
            },
        }
    ]
    const data: RowData [] = [
        {
            token_pair: 'ETH-YM1',
            total_stake_1: etherAmount,
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
            total_stake_1: etherAmount,
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
        <LiquidateLayout >
            <Content>
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
            </Content>
        </LiquidateLayout>
    );
}

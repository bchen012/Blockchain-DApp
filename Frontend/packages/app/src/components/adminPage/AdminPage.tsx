import React, {useMemo, useState} from 'react';
import AdminLayout from "./AdminLayout";
import {AdminTabs, TechFamilyTab} from './AdminTabs';
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
import {SetExchangeRate} from "./SetExchangeRate";
import {AdminBalance} from "./AdminBalance";
import {InitiatePage} from "./InitiatePage";
import {Button, Card, CardContent, CardMedia, TextField} from "@material-ui/core";

export const AdminPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>();
    const [account, setAccount] = useState<any>('');
    const [etherBalance, setEtherBalance] = useState<string>('')

    const [tokenA_P2, setTokenA_P2] = useState<string>('0');
    const [tokenB_P2, setTokenB_P2] = useState<string>('0');

    const [tokenA_P1, setTokenA_P1] = useState<string>('0');
    const [tokenB_P1, setTokenB_P1] = useState<string>('0');

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const kv2_contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    const k_mine_contract = new web3.eth.Contract(K_MINE_ABI, K_MINE_CONTRACT_ADDRESS);

    web3.eth.getAccounts().then(accounts => {
        setAccount(accounts[0]);
    });


    const getEthBalance = async () => {
        await kv2_contract.methods.getEtherBalance().call().then(etherBalance => {
            setEtherBalance(etherBalance/1e18);
        });
    };

    getEthBalance().then();

    const getPoolInfo = async () => {
        await k_mine_contract.methods.getPoolInfo('0').call().then(Result => {
            setTokenA_P1(Result[0]);
            setTokenB_P1(Result[1]);
        });
        await k_mine_contract.methods.getPoolInfo('1').call().then(Result => {
            setTokenA_P2(Result[0])
            setTokenB_P2(Result[1])
        });
    };

    getPoolInfo().then();

    const initialStake = async () => {
        k_mine_contract.methods.stake('0', web3.utils.toWei('50'), web3.utils.toWei('0')).send({from:account}).once('receipt', (receipt) => {
           console.log('INITIAL STAKE')
        });
    }

    const init = async () => {
        k_mine_contract.methods.setRewardLockerAddress(K_REWARD_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
            console.log('Rewards contract address set')
            k_mine_contract.methods.addPool('0x0000000000000000000000000000000000000000', YM1_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
                console.log('Pool 1 Added')
                k_mine_contract.methods.addPool('0x0000000000000000000000000000000000000000', YM2_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
                    console.log('Pool 2 Added')
                });
            });
        });
    };


    const setExchange = async (exchangeRate: string) => {
        await kv2_contract.methods.setExchangeRate(exchangeRate).send({from: account}).once('receipt', (receipt) => {
            console.log("Transfer success", receipt);
        });
    };


    const tabs = useMemo<TechFamilyTab[]>(
        () => [
            {
                id: 'exchange',
                label: 'Exchange Rate',
            },
            {
                id: 'balance',
                label: 'Ether Balance'
            },
            {
                id: 'initiate',
                label: 'Initiate'
            }
        ],
        [],
    );

    const TabContent = () => {
        console.log('tabcontent')
        if (selectedTab === 'Ether Balance')
            return <AdminBalance balance={etherBalance}/>
        else if (selectedTab === 'Initiate')
            return <InitiatePage init={init} tokenA_P1={tokenA_P1} tokenB_P1={tokenB_P1} tokenA_P2={tokenA_P2} tokenB_P2={tokenB_P2} initialStake={initialStake}/>
        return <SetExchangeRate setExchange={setExchange}/>
    }


    return (
        <AdminLayout >
            <AdminTabs
                tabs={tabs}
                onChange={({ label }) => setSelectedTab(label)}
            />
            <Content>
                <TabContent />
            </Content>
        </AdminLayout>
    );
}

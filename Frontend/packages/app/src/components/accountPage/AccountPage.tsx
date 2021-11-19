import React, {useEffect, useMemo, useState} from 'react';
import AccountLayout from './AccountLayout';
import {AccountTabs, TechFamilyTab} from './AccountTabs';
import {Content} from '@backstage/core-components';
import {AccountBalance} from '../tabComponents/AccountBalance'
import Web3 from "web3";
import {
    YM1_ABI, YM1_CONTRACT_ADDRESS,
    YM2_ABI, YM2_CONTRACT_ADDRESS
} from "../../config";
import { ExchangeService } from "../tabComponents/ExchangeService";
import {Chip} from "@material-ui/core";

export const AccountPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>();
    const [account, setAccount] = useState<any>('');
    const [ym1_balance, set_ym1_balance] = useState<any>('');
    const [ym2_balance, set_ym2_balance] = useState<any>('');
    const [eth_balance, set_eth_balance] = useState<any>('');

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

    const ym1_contract = new web3.eth.Contract(YM1_ABI, YM1_CONTRACT_ADDRESS);
    const ym2_contract = new web3.eth.Contract(YM2_ABI, YM2_CONTRACT_ADDRESS);


    const transfer = async (targetAddress: string, amount: string, token: string) => {
        amount =  web3.utils.toWei(amount);
        if (token === 'YM1'){
            await ym1_contract.methods.transfer(targetAddress, amount).send({from: account}).once('receipt', (receipt) => {
                console.log("Transfer YM1 success", receipt);
            });
        }
        else if (token === 'YM2') {
            await ym2_contract.methods.transfer(targetAddress, amount).send({from: account}).once('receipt', (receipt) => {
                console.log("Transfer YM2 success", receipt);
            });
        }
        else {
            await web3.eth.sendTransaction({from: account, to: targetAddress, value: amount}).once('receipt', (receipt) => {
                console.log("Transfer ETH success", receipt);
            });
        }

    }


    useEffect(() => {
        let isMounted: boolean = true;

        const getYm1Balance = async (address: string) => {
            await ym1_contract.methods.balanceOf(address).call().then(accountBalance => {
                if (isMounted) set_ym1_balance(accountBalance/1e18);
            });
        };

        const getYm2Balance = async (address: string) => {
            console.log('ADDRESS: ', account)
            await ym2_contract.methods.balanceOf(address).call().then(accountBalance => {
                if (isMounted) set_ym2_balance(accountBalance/1e18);
            });
        };

        web3.eth.getAccounts().then(accounts => {
            if (isMounted) {
                setAccount(accounts[0])
                console.log('SET ACCOUNT:', accounts[0]);
                // getKv2Balance(accounts[0]).then();
                getYm1Balance(accounts[0]).then();
                getYm2Balance(accounts[0]).then();
                web3.eth.getBalance(accounts[0]).then(value => {
                    if (isMounted) set_eth_balance(value/1e18);
                })
            }

        });
        return () => { isMounted = false };
    }, [selectedTab]);

    const tabs = useMemo<TechFamilyTab[]>(
        () => [
            {
                id: 'wallets',
                label: 'Wallets',
            },
            {
                id: 'transfer',
                label: 'Transfer',
            },
        ],
        [],
    );

    const TabContent = () => {
        if (selectedTab === 'Transfer') {
            return <ExchangeService transfer={transfer}/>
        }
        return <AccountBalance ym1_balance={ym1_balance} ym2_balance={ym2_balance} eth_balance={eth_balance}/>
    }


    return (
        <AccountLayout >
            <AccountTabs
                tabs={tabs}
                onChange={({ label }) => setSelectedTab(label)}
            />
            <Content>
                <Chip label={'Account: ' + account} />
                <TabContent />
            </Content>
        </AccountLayout>
    );
}

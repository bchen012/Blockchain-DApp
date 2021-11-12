import React, {useMemo, useState} from 'react';
import AccountLayout from './AccountLayout';
import {AccountTabs, TechFamilyTab} from './AccountTabs';
import {Content} from '@backstage/core-components';
import {AccountBalance} from '../tabComponents/AccountBalance'
import Web3 from "web3";
import { KV2_CONTRACT_ADDRESS, KV2_ABI } from "../../config";
import { ExchangeService } from "../tabComponents/ExchangeService";
import { SellService } from "../tabComponents/SellService";

export const AccountPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>();
    const [account, setAccount] = useState<any>('');
    const [balance, setBalance] = useState<any>('');
    const [exchangeRate, setExchangeRate] = useState<string>('');


    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    window.ethereum.enable().then(accounts => {
        setAccount(accounts[0]);
    })

    const contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);


    const getKv2Balance = async () => {
        await contract.methods.balanceOf(account).call().then(accountBalance => {
            setBalance(accountBalance/1e18);
        });
    };

    const transfer = async (targetAddress: string, amount: string) => {
        amount =  web3.utils.toWei(amount);
        await contract.methods.transfer(targetAddress, amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Transfer success", receipt);
        });
    }

    const sell = async (amount: string) => {
        await contract.methods.sellCoin(amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Sell success", receipt);
        });
    };

    const getExchangeRate = async () => {
        await contract.methods.getExchangeRate().call().then(exr => {
            setExchangeRate(exr);
        });
    };

    getExchangeRate().then();
    getKv2Balance().then()

    const tabs = useMemo<TechFamilyTab[]>(
        () => [
            {
                id: 'account',
                label: 'Account',
            },
            {
                id: 'transfer',
                label: 'Transfer',
            },
            {
                id: 'sell',
                label: 'Sell',
            },
        ],
        [],
    );

    const TabContent = () => {
        console.log('tabcontent')
        if (selectedTab === 'Transfer') {
            return <ExchangeService transfer={transfer}/>
        }
        else if (selectedTab === 'Sell') {
            return <SellService sell={sell} exchangeRate={exchangeRate}/>
        }

        return <AccountBalance account={account} balance={balance}/>
    }


    return (
        <AccountLayout >
            <AccountTabs
                tabs={tabs}
                onChange={({ label }) => setSelectedTab(label)}
            />
            <Content>
                <TabContent />
            </Content>
        </AccountLayout>
    );
}

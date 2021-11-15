import React, {useEffect, useMemo, useState} from 'react';
import AccountLayout from './AccountLayout';
import {AccountTabs, TechFamilyTab} from './AccountTabs';
import {Content} from '@backstage/core-components';
import {AccountBalance} from '../tabComponents/AccountBalance'
import Web3 from "web3";
import {
    KV2_CONTRACT_ADDRESS, KV2_ABI,
    YM1_ABI, YM1_CONTRACT_ADDRESS,
    YM2_ABI, YM2_CONTRACT_ADDRESS
} from "../../config";
import { ExchangeService } from "../tabComponents/ExchangeService";
import { SellService } from "../tabComponents/SellService";
import {Chip} from "@material-ui/core";

export const AccountPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>();
    const [account, setAccount] = useState<any>('');
    const [kv2_balance, set_kv2_balance] = useState<any>('');
    const [ym1_balance, set_ym1_balance] = useState<any>('');
    const [ym2_balance, set_ym2_balance] = useState<any>('');
    const [eth_balance, set_eth_balance] = useState<any>('');

    const [exchangeRate, setExchangeRate] = useState<string>('');


    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

    const kv2_contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    const ym1_contract = new web3.eth.Contract(YM1_ABI, YM1_CONTRACT_ADDRESS);
    const ym2_contract = new web3.eth.Contract(YM2_ABI, YM2_CONTRACT_ADDRESS);


    const transfer = async (targetAddress: string, amount: string) => {
        amount =  web3.utils.toWei(amount);
        await kv2_contract.methods.transfer(targetAddress, amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Transfer success", receipt);
        });
    }

    const sell = async (amount: string) => {
        await kv2_contract.methods.sellCoin(amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Sell success", receipt);
        });
    };

    // const getExchangeRate = async () => {
    //     await contract.methods.getExchangeRate().call().then(exr => {
    //         setExchangeRate(exr);
    //     });
    // };
    //
    // getExchangeRate().then();


    useEffect(() => {
        let isMounted: boolean = true;

        const getKv2Balance = async (address: string) => {
            await kv2_contract.methods.balanceOf(address).call().then(accountBalance => {
                if (isMounted) set_kv2_balance(accountBalance/1e18);
            });
        };

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
                getKv2Balance(accounts[0]).then();
                getYm1Balance(accounts[0]).then();
                getYm2Balance(accounts[0]).then();
                web3.eth.getBalance(accounts[0]).then(value => {
                    if (isMounted) set_eth_balance(value/1e18);
                })
            }

        });
        return () => { isMounted = false };
    }, []);

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

        return <AccountBalance ym1_balance={ym1_balance} ym2_balance={ym2_balance} kv2_balance={kv2_balance} eth_balance={eth_balance}/>
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

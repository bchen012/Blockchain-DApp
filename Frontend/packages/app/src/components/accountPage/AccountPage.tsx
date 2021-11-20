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
import {Chip, Snackbar} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export const AccountPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>();
    const [account, setAccount] = useState<any>('');
    const [ym1_balance, set_ym1_balance] = useState<any>('');
    const [ym2_balance, set_ym2_balance] = useState<any>('');
    const [eth_balance, set_eth_balance] = useState<any>('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

    const ym1_contract = new web3.eth.Contract(YM1_ABI, YM1_CONTRACT_ADDRESS);
    const ym2_contract = new web3.eth.Contract(YM2_ABI, YM2_CONTRACT_ADDRESS);


    const transfer = async (targetAddress: string, amount: string, token: string) => {
        amount =  web3.utils.toWei(amount);
        if (token === 'YM1'){
            await ym1_contract.methods.transfer(targetAddress, amount).send({from: account}).once('receipt', (receipt) => {
                setMessage("Transfer YM1 Success");
                setOpen(true);
            });
        }
        else if (token === 'YM2') {
            await ym2_contract.methods.transfer(targetAddress, amount).send({from: account}).once('receipt', (receipt) => {
                setMessage("Transfer YM2 Success");
                setOpen(true);
            });
        }
        else {
            await web3.eth.sendTransaction({from: account, to: targetAddress, value: amount}).once('receipt', (receipt) => {
                setMessage("Transfer ETH Success");
                setOpen(true);
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
            await ym2_contract.methods.balanceOf(address).call().then(accountBalance => {
                if (isMounted) set_ym2_balance(accountBalance/1e18);
            });
        };

        web3.eth.getAccounts().then(accounts => {
            if (isMounted) {
                setAccount(accounts[0])
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

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    return (
        <AccountLayout >
            <AccountTabs
                tabs={tabs}
                onChange={({ label }) => setSelectedTab(label)}
            />
            <Content>
                <Chip label={'Account: ' + account} />
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
                <TabContent />
            </Content>
        </AccountLayout>
    );
}

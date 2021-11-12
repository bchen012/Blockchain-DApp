import React, {useMemo, useState} from 'react';
import AdminLayout from "./AdminLayout";
import {AdminTabs, TechFamilyTab} from './AdminTabs';
import {Content} from '@backstage/core-components';
import Web3 from "web3";
import { KV2_CONTRACT_ADDRESS, KV2_ABI } from "../../config";
import {SetExchangeRate} from "./SetExchangeRate";
import {AdminBalance} from "./AdminBalance";

export const AdminPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>();
    const [account, setAccount] = useState<any>('');
    const [etherBalance, setEtherBalance] = useState<string>('')

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    web3.eth.getAccounts().then(accounts => {
        setAccount(accounts[0]);
    });

    const getEthBalance = async () => {
        await contract.methods.getEtherBalance().call().then(etherBalance => {
            setEtherBalance(etherBalance/1e18);
        });
    };

    getEthBalance().then();

    const setExchange = async (exchangeRate: string) => {
        await contract.methods.setExchangeRate(exchangeRate).send({from: account}).once('receipt', (receipt) => {
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
            }
        ],
        [],
    );

    const TabContent = () => {
        if (selectedTab === 'Ether Balance')
            return <AdminBalance balance={etherBalance}/>
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

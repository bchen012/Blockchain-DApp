import LiquidateLayout from "./LiquidateLayout";
import {Content} from '@backstage/core-components';
import {Chip} from "@material-ui/core";
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
import React, {useState, useEffect, useMemo} from "react";
import {LiquidityTable} from "./LiquidityTable";
import {LiquidateTabs, TechFamilyTab} from "./LiquidateTabs";
import {EditLiquidity} from "./EditLiquidity";

export const LiquidatePage = () => {

    const [account, setAccount] = useState<any>('');
    const [selectedTab, setSelectedTab] = useState<string>();
    const [selectedToken2, setSelectedToken2] = useState<string>('YM1');
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const k_mine_contract = new web3.eth.Contract(K_MINE_ABI, K_MINE_CONTRACT_ADDRESS);
    const ym1_contract = new web3.eth.Contract(YM1_ABI, YM1_CONTRACT_ADDRESS);
    const ym2_contract = new web3.eth.Contract(YM2_ABI, YM2_CONTRACT_ADDRESS);

    const stake_tokens = async (token1: string, token2: string, token1Amount: string, token2Amount: string, add: boolean) => {
        if (add){
            if (parseInt(token1Amount) > 0)
                deposit_tokens(token1, token1Amount).then();
            if (parseInt(token2Amount) > 0)
                deposit_tokens(token2, token2Amount).then();
        }
    }

    const deposit_tokens = async (token: string, amount: string) => {
        amount = web3.utils.toWei(amount)
        console.log('STAKE ACCOUNT: ', account)
        if (token === 'ETH') {
            k_mine_contract.methods.stake('0', amount, web3.utils.toWei('0'))
                .send({from:account, to:K_MINE_CONTRACT_ADDRESS, value:amount})
                .once('receipt', (receipt) => {
                    console.log('Stake', amount, token)
                    console.log('Transferred', amount, token)
                });
        }
        else if (token === 'YM1') {
            ym1_contract.methods.approve(K_MINE_CONTRACT_ADDRESS, amount)
                .send({from: account})
                .once('receipt', (receipt) => {
                    console.log('APPROVED')
                    k_mine_contract.methods.stake('0', web3.utils.toWei('0'), amount)
                        .send({from: account, to: K_MINE_CONTRACT_ADDRESS, value: web3.utils.toWei('0')})
                        .once('receipt', (receipt) => {
                            console.log('Stake', amount, token)
                        });
                });
        }
        else {
            ym2_contract.methods.approve(K_MINE_CONTRACT_ADDRESS, amount)
                .send({from:account})
                .once('receipt', (receipt) => {
                    console.log('APPROVED')
                    k_mine_contract.methods.stake('1', web3.utils.toWei('0'), amount)
                        .send({from:account, to:K_MINE_CONTRACT_ADDRESS, value:web3.utils.toWei('0')})
                        .once('receipt', (receipt) => {
                            console.log('Stake', amount, token)
                        });
                })
        }
    };

    useEffect(() => {
        let isMounted: boolean = true;
        web3.eth.getAccounts().then(accounts => {
            if (isMounted) {
                setAccount(accounts[0])
                console.log('SET ACCOUNT:', accounts[0]);
            };
        });

        return () => { isMounted = false };
    }, []);



    const tabs = useMemo<TechFamilyTab[]>(
        () => [
            {
                id: 'pool pairs',
                label: 'Pool Pairs',
            },
            {
                id: 'add liquidity',
                label: 'Add Liquidity'
            },
            {
                id: 'remove liquidity',
                label: 'Remove Liquidity'
            }
        ],
        [],
    );

    const TabContent = () => {
        console.log('tabcontent')
        if (selectedTab === 'Add Liquidity')
            return <EditLiquidity Token_1={'ETH'} Token_2={selectedToken2} Add={true} stake_tokens={stake_tokens}/>
        else if (selectedTab === 'Remove Liquidity')
            return <EditLiquidity Token_1={'ETH'} Token_2={selectedToken2} Add={false} stake_tokens={stake_tokens}/>

        return <LiquidityTable k_mine_contract={k_mine_contract}/>
    }

    return (
        <LiquidateLayout >
            <LiquidateTabs
                tabs={tabs}
                onChange={({ label }) => setSelectedTab(label)}
            />
            <Content>
                <Chip label={'Account: ' + account} />
                <TabContent />
            </Content>
        </LiquidateLayout>
    );
}

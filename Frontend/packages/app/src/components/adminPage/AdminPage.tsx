import React, {useEffect, useMemo, useState} from 'react';
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
    YM2_CONTRACT_ADDRESS,
    YM1_ABI,
    YM2_ABI,
    KV6_ABI, KV6_CONTRACT_ADDRESS, K_REWARD_ABI
} from "../../config";
import {SetExchangeRate} from "./SetExchangeRate";
import {InitiatePage} from "./InitiatePage";
import {TopUpKv2} from "./TopUpKv2";

export const AdminPage = () => {
    const [selectedTab, setSelectedTab] = useState<string>();
    const [account, setAccount] = useState<any>('');
    const [kv2_balance, setKV2Balance] = useState('0');
    const [contract_balance, setContractBalance] = useState('0');
    const [priceRanges, setPriceRanges] = useState<string[]>([]);

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const kv2_contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    const k_mine_contract = new web3.eth.Contract(K_MINE_ABI, K_MINE_CONTRACT_ADDRESS);
    const ym1_contract = new web3.eth.Contract(YM1_ABI, YM1_CONTRACT_ADDRESS);
    const ym2_contract = new web3.eth.Contract(YM2_ABI, YM2_CONTRACT_ADDRESS);
    const kv6_contract = new web3.eth.Contract(KV6_ABI, KV6_CONTRACT_ADDRESS);
    const k_rewards_contract = new web3.eth.Contract(K_REWARD_ABI, K_REWARD_CONTRACT_ADDRESS);

    const top_up_kv2 = async (amount: string) => {
        kv2_contract.methods.transfer(K_REWARD_CONTRACT_ADDRESS, web3.utils.toWei(amount)).send({from: account}).once('receipt', (receipt) => {
            console.log('TOPPED UP KV2')
        });
    }

    useEffect(() => {
        let isMounted: boolean = true;

        const getKV2Balance = async (address: string) => {
            console.log('ADDRESS: ', account)
            return await kv2_contract.methods.balanceOf(address).call().then(accountBalance => {
                return accountBalance/1e18
            });
        };

        web3.eth.getAccounts().then(accounts => {
            if (isMounted) {
                setAccount(accounts[0])
                getKV2Balance(accounts[0]).then(result => {
                    setKV2Balance(result);
                });
                getKV2Balance(K_REWARD_CONTRACT_ADDRESS).then(result => {
                    setContractBalance(result);
                })
            }
        });

        kv6_contract.methods.getPriceRange().call().then(result => {
            if (isMounted) setPriceRanges(result.map(price => price/1e18));
        })

        return () => { isMounted = false };
    }, []);

    const initialStake = async () => {
        const initial_stake_amount_eth = '50';
        const initial_stake_amount_ym = '500';

        k_mine_contract.methods.stake('0', web3.utils.toWei(initial_stake_amount_eth), web3.utils.toWei('0'))
            .send({from:account, to:K_MINE_CONTRACT_ADDRESS, value:web3.utils.toWei(initial_stake_amount_eth)})
            .once('receipt', (receipt) => {
               console.log('INITIAL ETH STAKE DONE')

                ym1_contract.methods.approve(K_MINE_CONTRACT_ADDRESS, web3.utils.toWei(initial_stake_amount_ym))
                    .send({from:account})
                    .once('receipt', (receipt) => {
                        console.log('YM1 APPROVED')

                        k_mine_contract.methods.stake('0', web3.utils.toWei('0'), web3.utils.toWei(initial_stake_amount_ym))
                            .send({
                                from: account,
                                to: K_MINE_CONTRACT_ADDRESS,
                                value: web3.utils.toWei('0')
                            })
                            .once('receipt', (receipt) => {
                                console.log('INITIAL YM1 STAKE')

                                ym2_contract.methods.approve(K_MINE_CONTRACT_ADDRESS, web3.utils.toWei(initial_stake_amount_ym))
                                    .send({from:account})
                                    .once('receipt', (receipt) => {
                                        console.log('YM2 APPROVED')

                                        k_mine_contract.methods.stake('1', web3.utils.toWei('0'), web3.utils.toWei(initial_stake_amount_ym))
                                            .send({
                                                from: account,
                                                to: K_MINE_CONTRACT_ADDRESS,
                                                value: web3.utils.toWei('0')
                                            })
                                            .once('receipt', (receipt) => {
                                                console.log('INITIAL YM2 STAKE')
                                            });
                                    });
                            });
                    });
            });
    }

    const init = async () => {
        k_mine_contract.methods.setRewardLockerAddress(K_REWARD_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
            console.log('Rewards contract address set')
            k_mine_contract.methods.addPool('0x0000000000000000000000000000000000000000', YM1_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
                console.log('Pool 1 Added')
                k_mine_contract.methods.addPool('0x0000000000000000000000000000000000000000', YM2_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
                    console.log('Pool 2 Added')
                    kv6_contract.methods.setRewardTokenAddress(KV2_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
                        console.log('Reward token address set')
                        k_rewards_contract.methods.setNativeTokenAddress(KV2_CONTRACT_ADDRESS).send({from: account}).once('receipt', (receipt) => {
                            console.log('Native Reward token address set')
                        });
                    });
                });
            });
        });
    };


    const setExchange = async (id: string, price: string) => {
        await kv6_contract.methods.modifyPriceRange(id, web3.utils.toWei(price)).send({from: account}).once('receipt', (receipt) => {
            console.log("Price Set", receipt);
        });
    };


    const tabs = useMemo<TechFamilyTab[]>(
        () => [
            {
                id: 'exchange',
                label: 'Exchange Rate',
            },
            {
                id: 'top up',
                label: 'Top Up'
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
        if (selectedTab === 'Initiate')
            return <InitiatePage init={init} initialStake={initialStake}/>
        else if (selectedTab === 'Top Up')
            return <TopUpKv2 topUp={top_up_kv2} kv2Balance={kv2_balance} contractBalance={contract_balance}/>
        return <SetExchangeRate setExchange={setExchange} priceRanges={priceRanges}/>
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

import NftStoreLayout from "./NftStoreLayout";
import {Content} from '@backstage/core-components';
import Web3 from "web3";
import {KV2_CONTRACT_ADDRESS, KV2_ABI, KV6_CONTRACT_ADDRESS, KV6_ABI, K_REWARD_ABI, K_REWARD_CONTRACT_ADDRESS} from "../../config";
import {Button, Card, CardContent, CardMedia} from "@material-ui/core";
import React, {useEffect, useMemo, useState} from "react";
import petsJson from "../../pets.json"
import MonetizationOnIcon from '@material-ui/icons//MonetizationOn';
import {NFTStoreTabs, TechFamilyTab} from "./NftStoreTabs";
import {RewardsPage} from "./RewardsPage";

export const NftStorePage = () => {

    const [account, setAccount] = useState<any>('');
    const [selectedTab, setSelectedTab] = useState<string>('');
    const [kv2Balance, setKv2Balance] = useState<string>('');
    const [redeemable, setRedeemable] = useState<string>('0');

    const rarityMap = new Map([
        [1, 'common'],
        [2, 'rare'],
        [3, 'legendary'],
        [4, 'mythical']
    ]);
    const rarity_to_color_map = new Map([
        [1, 'mediumseagreen'],
        [2, 'dodgerblue'],
        [3, 'tomato'],
        [4, 'slateblue']
    ]);

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const kv2_contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    const kv6_contract = new web3.eth.Contract(KV6_ABI, KV6_CONTRACT_ADDRESS);
    const k_reward_contract = new web3.eth.Contract(K_REWARD_ABI, K_REWARD_CONTRACT_ADDRESS);

    useEffect(() => {
        let isMounted: boolean = true;

        const getKV2Balance = async (address: string) => {
            await kv2_contract.methods.balanceOf(address).call().then(accountBalance => {
                if (isMounted) setKv2Balance(accountBalance/1e18);
            });
        };

        const getRedeemable = async (address: string) => {
            await k_reward_contract.methods.calculate_current_redeemable().call({from:address}).then(result => {
                console.log('REDEEMABLE: ', result)
                if (isMounted) setRedeemable(result/1e18);
            })
        };

        web3.eth.getAccounts().then(accounts => {
            if (isMounted) {
                setAccount(accounts[0])
                getKV2Balance(accounts[0]).then();
                getRedeemable(accounts[0]).then();
            }
        });
        return () => { isMounted = false };
    }, [selectedTab]);

    const purchaseNFT = async (uri: string, price: string, rarity: number) => {
        let amount = web3.utils.toWei(price);
        await kv2_contract.methods.approve(KV6_CONTRACT_ADDRESS, amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Purchase approved", receipt);
            kv6_contract.methods.awardNFT(uri, rarity, amount, account)
                .send({from: account})
                .once('receipt', (receipt) => {
                    console.log('NFT Awarded')
                });
        });
    };

    const tabs = useMemo<TechFamilyTab[]>(
        () => [
            {
                id: 'NFT store',
                label: 'NFT Store',
            },
            {
                id: 'Reward Token',
                label: 'Reward Token'
            },
        ],
        [],
    );

    const NFTs = petsJson.map((val) => {
        return (
            <div>
                <Card >
                    <CardMedia
                        component="img"
                        // height="450"
                        image={val.image}
                    />
                    <CardContent>
                        <h2>{val.name}</h2>
                        <h3>Price: {val.price} KV2 <MonetizationOnIcon/></h3>
                        <h3 style={{color:rarity_to_color_map.get(val.rarity)}}>{rarityMap.get(val.rarity)}</h3>
                        Description: {val.description}
                        <br/>
                        <br/>
                        <Button variant="contained" onClick={()=>{
                            purchaseNFT(`https://nftv1-n6hllfzhqa-as.a.run.app/static/json_dir/klee_${val.id+1}.json`, val.price, val.rarity).then()
                        }}>Buy</Button>
                    </CardContent>
                </Card>
                <br/>
                <br/>
            </div>
        )
    })

    const TabContent = () => {
        console.log('tabcontent')
        if (selectedTab === 'Reward Token')
            return <RewardsPage balance={kv2Balance} redeemable={redeemable}/>
        return NFTs
    }

    return (
        <NftStoreLayout >
            <NFTStoreTabs
                tabs={tabs}
                onChange={({ label }) => setSelectedTab(label)}
            />
            <Content>
                <TabContent />
            </Content>
        </NftStoreLayout>
    );
}

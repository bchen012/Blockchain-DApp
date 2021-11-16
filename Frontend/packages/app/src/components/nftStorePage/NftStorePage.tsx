import NftStoreLayout from "./NftStoreLayout";
import {Content} from '@backstage/core-components';
import Web3 from "web3";
import {KV2_CONTRACT_ADDRESS, KV2_ABI, KV6_CONTRACT_ADDRESS, KV6_ABI, K_MINE_CONTRACT_ADDRESS} from "../../config";
import {Button, Card, CardContent, CardMedia} from "@material-ui/core";
import React, {useState} from "react";
import petsJson from "../../pets.json"
import MonetizationOnIcon from '@material-ui/icons//MonetizationOn';

export const NftStorePage = () => {

    const [account, setAccount] = useState<any>('');

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
    web3.eth.getAccounts().then(accounts => {
        setAccount(accounts[0]);
    });

    const purchaseNFT = async (uri: string, price: string) => {
        let amount = web3.utils.toWei(price);
        await kv2_contract.methods.approve(KV6_CONTRACT_ADDRESS, amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Purchase approved", receipt);
            kv6_contract.methods.awardNFT(uri, amount, account)
                .send({from: account})
                .once('receipt', (receipt) => {
                    console.log('NFT Awarded')
                });
        });


    }

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
                            purchaseNFT(`https://nftv1-n6hllfzhqa-as.a.run.app/static/json_dir/klee_${val.id+1}.json`, val.price).then()
                        }}>Buy</Button>
                    </CardContent>
                </Card>
                <br/>
                <br/>
            </div>
        )
    })

    return (
        <NftStoreLayout >
            <Content>
                {NFTs}
            </Content>
        </NftStoreLayout>
    );
}

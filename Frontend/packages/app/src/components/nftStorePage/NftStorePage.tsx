import NftStoreLayout from "./NftStoreLayout";
import {Content} from '@backstage/core-components';
import Web3 from "web3";
import { KV2_CONTRACT_ADDRESS, KV2_ABI, KV6_CONTRACT_ADDRESS, KV6_ABI } from "../../config";
import {Button, Card, CardContent, CardMedia, TextField} from "@material-ui/core";
import React, {useState} from "react";
import petsJson from "../../pets.json"

export const NftStorePage = () => {

    const [account, setAccount] = useState<any>('');
    const [purchaseAmount, setPurchaseAmount] = useState<any>('0');

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const kv2_contract = new web3.eth.Contract(KV2_ABI, KV2_CONTRACT_ADDRESS);
    const kv6_contract = new web3.eth.Contract(KV6_ABI, KV6_CONTRACT_ADDRESS);
    web3.eth.getAccounts().then(accounts => {
        setAccount(accounts[0]);
    });

    const purchaseNFT = async (uri: string) => {
        let amount = web3.utils.toWei(purchaseAmount);
        await kv2_contract.methods.approve(KV6_CONTRACT_ADDRESS, amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Purchase success", receipt);
        });

        await kv6_contract.methods.awardBakudan(uri, amount).send({from: account}).once('receipt', (receipt) => {
            console.log("Token minted", receipt);
        });
    }

    const NFTs = petsJson.map((val) => {
        console.log(val)
        return (
            <Card >
                <CardMedia
                    component="img"
                    // height="450"
                    image={val.image}
                />
                <CardContent>
                    <h2>{val.name}</h2>
                    <h3>{val.description}</h3>
                    <h3>Rarity: {val.rarity}</h3>
                    <div>
                        <TextField
                            required
                            id="outlined-required"
                            label="Amount"
                            defaultValue=""
                            value={purchaseAmount}
                            fullWidth
                            onChange={(e) => setPurchaseAmount(e.target.value)}
                            autoComplete={"off"}
                        />
                        <br/>

                    </div>
                    <br/>
                    <Button variant="contained" onClick={()=>{
                        purchaseNFT(`https://nftv1-n6hllfzhqa-as.a.run.app/static/json_dir/klee_${val.id+1}.json`).then()
                    }}>Buy</Button>
                </CardContent>
            </Card>
        )
    })

    return (
        <NftStoreLayout >
            <Content>
                <div>
                {NFTs}
                </div>
            </Content>
        </NftStoreLayout>
    );
}

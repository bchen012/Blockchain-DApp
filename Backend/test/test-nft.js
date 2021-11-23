const { expect } = require("chai");
const { ethers,waffle } = require("hardhat");

describe("NFT Reward Test", function () {

  let NFT;
  let nft;
  let RewardToken;
  let rewardToken;
  let owner;
  let user;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    NFT = await ethers.getContractFactory("KleeTokenV6");
    RewardToken = await ethers.getContractFactory("KleeCoinV2");
    [owner, user,...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    nft = await NFT.deploy();
    rewardToken = await RewardToken.deploy();
    await nft.setRewardTokenAddress(rewardToken.address);
  });

  it("Should be able to buy NFT if you have KV2", async function () {
    //we will use owner account as it already has 1000 KV2
    // with this we can buy 1 common NFT
    const URI = "somerandomstring";
    const amount = ethers.utils.parseEther("500");
    await rewardToken.approve(nft.address,amount);
    await nft.awardNFT(URI,0,amount,owner.address);
    expect(await nft.ownerOf(1)).to.equal(owner.address);
    expect(await nft.tokenURI(1)).to.equal(URI);

    });
 
    it("Should be able to buy legendary NFT if you have 10000 KV2", async function () {
        //we will use owner account as it already has 1000 KV2
        // with this we can buy 1 common NFT
        const URI = "somerandomstring2";
        const amount = ethers.utils.parseEther("10000");
        await rewardToken.happyProblem(owner.address,9000);
        await rewardToken.approve(nft.address,amount);
        await nft.awardNFT(URI,0,amount,owner.address);
        expect(await nft.ownerOf(1)).to.equal(owner.address);
        expect(await nft.tokenURI(1)).to.equal(URI);
    
        });

        it("Should not be able to buy legendary NFT if you have less than 10000 KV2", async function () {
            // as legendary nft cost 10k KV2 and owner only has 500, 
            // this transaction should be reverted
            const URI = "somerandomstring3";
            const amount = ethers.utils.parseEther("500");
            await rewardToken.approve(nft.address,amount);
            expect(nft.awardNFT(URI,0,amount,owner.address)).to.be.reverted;
        
        });
  
});

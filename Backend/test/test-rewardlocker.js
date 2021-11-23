const { expect } = require("chai");
const { ethers,waffle } = require("hardhat");

describe("RewardLocker Reward Test", function () {

  let RewardLocker;
  let rewardLocker;
  let RewardToken;
  let rewardToken;
  let owner;
  let user;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    RewardLocker = await ethers.getContractFactory("KleeRewardV2");
    RewardToken = await ethers.getContractFactory("KleeCoinV2");
    [owner, user,...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    rewardLocker = await RewardLocker.deploy();
    rewardToken = await RewardToken.deploy();
    await rewardLocker.setNativeTokenAddress(rewardToken.address);
  });

  it("Should be able to deposit", async function () {
    await rewardLocker.deposit(25,owner.address);
    //expect(rewardLocker.claimantExists.calls(owner.address)).to.be.true;
  });

  it("Should be able to see after some time the reward that can be redeemed increase", async function () {
    await rewardLocker.deposit(25,owner.address);
    const prev_reward = await rewardLocker.calculate_current_redeemable(
      {from:owner.address}
    );
    //simulate some transactions
    await rewardToken.setExchangeRate(1);
    await rewardToken.setExchangeRate(10);
    await rewardToken.setExchangeRate(100);
    await rewardToken.setExchangeRate(1000);
    await rewardToken.setExchangeRate(10);
    const aft_reward = await rewardLocker.calculate_current_redeemable(
      {from:owner.address}
    );
    expect(prev_reward).to.lt(aft_reward);
  })

  it("Should be able to see reward reached the maximum amount", async function () {
    await rewardLocker.deposit(25,owner.address);
    await rewardLocker.setDripRate(1);

    //simulate some transactions
    await rewardToken.setExchangeRate(1);
    await rewardToken.setExchangeRate(10);
    await rewardToken.setExchangeRate(100);
    await rewardToken.setExchangeRate(1000);
    const prev_reward = await rewardLocker.calculate_current_redeemable(
      {from:owner.address}
    );
    await rewardToken.setExchangeRate(100);
    await rewardToken.setExchangeRate(1000);
    await rewardToken.setExchangeRate(10);
    const aft_reward = await rewardLocker.calculate_current_redeemable(
      {from:owner.address}
    );
    expect(prev_reward).to.equal(aft_reward);
  })

  it("Should be able to claim the reward", async function () {
    await rewardLocker.deposit(25,owner.address);
    await rewardLocker.setDripRate(1);

    //give the reward Locker the money to distribute
    await rewardToken.happyProblem(rewardLocker.address,10000);
    
    //simulate some transactions
    await rewardToken.setExchangeRate(1);
    await rewardToken.setExchangeRate(10);
    await rewardToken.setExchangeRate(100);
    await rewardToken.setExchangeRate(1000);
    await rewardToken.setExchangeRate(10);

    const reward = await rewardLocker.calculate_current_redeemable(
      {from:owner.address}
    );
    const prev_bal = await rewardToken.balanceOf(owner.address);
    await rewardLocker.redeem({
      from: owner.address
    })
    const aft_bal = await rewardToken.balanceOf(owner.address);
    expect(aft_bal).to.equal(
      reward.add(prev_bal)
    );
  })

  

  it("Should be able to see quadratic fairness", async function () {
    const big_LP = await rewardLocker.calculate_reward(50);
    const smol_LP = await rewardLocker.calculate_reward(25);
    //check their multiplier is different
    expect(big_LP.div(50)).to.gt(smol_LP.div(25));
  });
 
    
  
});

const { expect } = require("chai");
const { ethers,waffle } = require("hardhat");

describe("Liquidity Mining Test", function () {

  let RewardLocker,rewardLocker;
  let RewardToken, rewardToken;
  let MockCoin1, mockcoin1;
  let Mine,mine;
  let owner,user,addrs;
  const addr_0 = '0x0000000000000000000000000000000000000000';

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    RewardLocker = await ethers.getContractFactory("KleeRewardV2");
    RewardToken = await ethers.getContractFactory("KleeCoinV2");
    Mine = await ethers.getContractFactory("KleeMine");
    MockCoin1 = await ethers.getContractFactory("YM1");
    [owner, user,...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    rewardLocker = await RewardLocker.deploy();
    rewardToken = await RewardToken.deploy();
    mine = await Mine.deploy();
    mockCoin1 = await MockCoin1.deploy();

    await rewardLocker.setNativeTokenAddress(rewardToken.address);
    await mine.setRewardLockerAddress(rewardLocker.address);
  });

  it("Should be able to set up pools", async function () {
    mine.addPool(addr_0,mockCoin1.address);

    const a = await mine.getPoolInfo(0);
    expect(a[0]).to.equal(0);
    expect(a[1]).to.equal(0);
  });

  it("Should be able to do the initial stake by owner", async function () {
    mine.addPool(addr_0,mockCoin1.address);
    const eth_amount = ethers.utils.parseEther("1.0");
    const ym1_amount = ethers.utils.parseEther("10");

    await mockCoin1.approve(mine.address,ym1_amount,{
        from:owner.address
    })
    await mine.stake(0,eth_amount,ym1_amount, {
        from:owner.address,
        value:eth_amount,
    })
    const a = await mine.getPoolInfo(0);
    expect(a[0]).to.equal(eth_amount);
    expect(a[1]).to.equal(ym1_amount);
  });

  it("Should be able to stake afterwards and get reward", async function () {
    //setup pool
    mine.addPool(addr_0,mockCoin1.address);
    const eth_amount = ethers.utils.parseEther("1.0");
    const ym1_amount = ethers.utils.parseEther("10");

    //intial stake
    await mockCoin1.approve(mine.address,ym1_amount,{
        from:owner.address
    })
    await mine.stake(0,eth_amount,ym1_amount, {
        from:owner.address,
        value:eth_amount,
    })
    //transfer some ym1 to user so he can stake
    await mockCoin1.transfer(user.address,ym1_amount);
    
    //next stake
    await mockCoin1.connect(user).approve(mine.address,ym1_amount,{
        from:user.address
    })
    await mine.connect(user).stake(0,eth_amount,ym1_amount,{
        from:user.address,
        value:eth_amount,
    })
    //simulate some transaction
    await rewardToken.setExchangeRate(1);

    //check reward
    let reward;
    reward = await rewardLocker.connect(user).calculate_current_redeemable(
        {from:user.address}
      );
    expect(reward).to.gt(0);
    // accelerate time
    await rewardLocker.setDripRate(1);
    await rewardToken.setExchangeRate(1);
    await rewardToken.setExchangeRate(10);

    const suppose_reward = await rewardLocker.calculate_reward(50);
    reward = await rewardLocker.connect(user).calculate_current_redeemable(
        {from:user.address}
      );
    expect(reward).to.equal(suppose_reward);


  });
  


 
    
  
});

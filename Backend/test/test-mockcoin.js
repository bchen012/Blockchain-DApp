const { expect } = require("chai");
const { ethers,waffle } = require("hardhat");

describe("Mock Coin Test", function () {

  let Token;
  let token;
  let owner;
  let user;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("YM1");
    [owner, user,...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    token = await Token.deploy();
  });

  it("Should mint 1000 coins to owner and itself", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("1000","ether"));
    expect(await token.balanceOf(token.address)).to.equal(ethers.utils.parseUnits("1000","ether"));
  });

  it("Should be able to set and get exchange rate with owner", async function() {
    await token.setExchangeRate(69420);
    expect(await token.getExchangeRate()).to.equal(69420);
  });

  it("Should be able to buy coin with ethers", async function() {
    const newEXR = 17;
    await token.setExchangeRate(newEXR);
    await token.buyCoin({
        from: owner.address,
        value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
    });
    
    expect(await token.balanceOf(owner.address)).to.equal(
        ethers.utils.parseEther((newEXR+1000).toString()));
  });

  it("Should be able to increase ether in token after transaction", async function() {
    const newEXR = 17;
    await token.setExchangeRate(newEXR);
    await token.buyCoin({
        from: owner.address,
        value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
    });
    
    expect(await token.getEtherBalance()).to.equal(
        ethers.utils.parseEther("1.0"));
  });

  it("Should be able to sell token for eth", async function() {
    const newEXR = 10;
    const provider = waffle.provider;
    await token.setExchangeRate(newEXR);
    const prev_bal = await provider.getBalance(owner.address);

    await token.connect(user).buyCoin({
        from: user.address,
        value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
    });
    await token.setExchangeRate(1);
    await token.sellCoin(1,
        {
            from:owner.address,
        }
    )
    
    //check if buyer get 10 coins
    expect(await token.balanceOf(user.address)).to.equal(ethers.utils.parseEther("10"));
   
    //check if we can rug pull    
    const cur_bal = await provider.getBalance(owner.address);

    //only check first 5 digits cuz of gas fees
    expect(cur_bal.toString().slice(0,5)).to.equal(
        ethers.utils.parseEther("1.0").add(prev_bal).toString().slice(0,5));
  });
  
});

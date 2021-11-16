// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {SafeMath} from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';

interface RewardLockerInterface {
        function deposit(uint256 shares,address recipient_addr) external; 
} 


//@dev: contract for liquidity mining
//    : only allow staking of ERC20 token - ETH pairs
contract KleeMine is Ownable {
    using SafeMath for uint256;
    using SafeCast for uint256;

    struct PoolInfo {
        address TokenA;
        address TokenB;
        uint256 TokenA_amount;
        uint256 TokenB_amount;
    }
    struct UserInfo {
        uint256 TokenAAmount;
        uint256 TokenBAmount;
    }
    PoolInfo[] pools;
    mapping(uint256 => mapping(address => UserInfo)) internal userInfo;
    mapping(uint256 => mapping(address => bool)) internal LPExists;

    address _RewardLockerAddress;
    RewardLockerInterface private _RewardLocker;

    constructor()  {
    }

    function setRewardLockerAddress(address newRL) external onlyOwner {
        _RewardLockerAddress = address(newRL);
        _RewardLocker = RewardLockerInterface(_RewardLockerAddress);
    }

// ##############   pool related functions  ######################
    function addPool(address tokenA, address tokenB) public {
        pools.push(PoolInfo(tokenA,tokenB,0,0));
    }
    function getPoolInfo(uint256 poolID) public view returns(uint256,uint256) {
        return (pools[poolID].TokenA_amount,pools[poolID].TokenB_amount);
    }

    function getUserStakeInfo(uint256 poolID) public view returns(uint256,uint256) {
        return (userInfo[poolID][_msgSender()].TokenAAmount,userInfo[poolID][_msgSender()].TokenBAmount);
    }

// ################## helper functions 
    function _deposit(address _tokenAddr,uint256 amount,address user_addr) public payable {
        //transfer the money from certain coins to the pools
        IERC20 _ERC20Token;
        if (_tokenAddr == address(0))  {//native token- eth
            //the amount of eth send here will be given to the contract
        } else {
            _ERC20Token = IERC20(_tokenAddr);
            _ERC20Token.transferFrom(address(user_addr),address(this),amount);
        }

    }

    function _withdraw(address _tokenAddr,uint256 amount,address user_addr) internal {
        IERC20 _ERC20Token; 
        if (_tokenAddr == address(0))  {//native token- eth
            payable(address(user_addr)).transfer(amount);
        } else {
            _ERC20Token = IERC20(_tokenAddr);
            _ERC20Token.transfer(address(user_addr),amount);
        }
    }

    function calculate_shares(uint256 poolID, uint256 amountA, uint256 amountB) view private returns(uint256) {
        //gonna assume that the ratio is correct and I dont have to do min of ratio
        //also will assume that pool is not empty as this thing is only called when it is after 
        //initial stake
        // if they contribute 100% of the liquid, i take that as 100 shares
        return amountA.mul(100).div(pools[poolID].TokenA_amount);
    }

// ### core functions 
    function stake(uint256 poolID,uint256 amountA, uint256 amountB) public payable {
        require(poolID < pools.length);
        address user_addr = _msgSender();
        _deposit(pools[poolID].TokenA,amountA,address(user_addr));
        _deposit(pools[poolID].TokenB,amountB,address(user_addr));
        if (!LPExists[poolID][_msgSender()]) {
            LPExists[poolID][_msgSender()] = true;
        }

        // if they sent ether to the pool, we need to ignore the param amountX
        // by overwriting the amountX with the msg.value (the actual ether sent)
        if (pools[poolID].TokenA == address(0)) {
           amountA = msg.value;
        }
        if (pools[poolID].TokenB == address(0)) {
            amountB = msg.value;
        } 

        //update user contribution record
        UserInfo storage deezUser = userInfo[poolID][user_addr];
        deezUser.TokenAAmount = userInfo[poolID][user_addr].TokenAAmount.add(amountA);
        deezUser.TokenBAmount = userInfo[poolID][user_addr].TokenBAmount.add(amountB);
        
        //update pool stake amount 
        PoolInfo storage deezPool = pools[poolID];
        deezPool.TokenA_amount = pools[poolID].TokenA_amount.add(amountA);
        deezPool.TokenB_amount = pools[poolID].TokenB_amount.add(amountB);


        if (pools[poolID].TokenA_amount != 0) {
            uint256 shares = calculate_shares(poolID,amountA,amountB);
            _RewardLocker.deposit(shares,user_addr);
        }
  
    }

    //@dev: this is for the DMM, I will not implement it lmao 
    function swap(uint256 poolID,address SourceToken, uint256 amount_SrcToken) public returns (uint256) {
        bool x = SourceToken == pools[poolID].TokenA;
        //TODO: implement constant product formula for non-eth pools
        //    : charge 0.3% eth like uniswap
        // 
        uint256 tx_fee = 3 * 10 **15; 
        uint256 amount_DstToken; 
        require(poolID<2);  //these pools got ether as token A
        if (x) {
             //if they want to sell tokenA and buy tokenB
            uint256 poolETH = pools[poolID.TokenA];
            
        }
        else {
            //if they want to sell tokenB and buy token A
            amount_DstToken = 0;
        }
        


    }



    function harvestOnePool(uint256 poolID) public {
        require(poolID < pools.length);
        require(LPExists[poolID][_msgSender()] == true);
        address user_addr = _msgSender();
        uint256 amountA = userInfo[poolID][_msgSender()].TokenAAmount;
        uint256 amountB = userInfo[poolID][_msgSender()].TokenBAmount;
        _withdraw(pools[poolID].TokenA,amountA,address(user_addr));
        _withdraw(pools[poolID].TokenB,amountB,address(user_addr));

        UserInfo storage deezUser = userInfo[poolID][_msgSender()];
        deezUser.TokenAAmount = userInfo[poolID][_msgSender()].TokenAAmount.sub(amountA);
        deezUser.TokenBAmount = userInfo[poolID][_msgSender()].TokenBAmount.sub(amountB);
        
        PoolInfo storage deezPool = pools[poolID];
        deezPool.TokenA_amount = pools[poolID].TokenA_amount.sub(amountA);
        deezPool.TokenB_amount = pools[poolID].TokenB_amount.sub(amountB);
        
        LPExists[poolID][_msgSender()] = false;

     }
}

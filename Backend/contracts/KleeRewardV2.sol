// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {SafeMath} from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';


contract KleeRewardV2 is Ownable {
    using SafeMath for uint256;
    using SafeCast for uint256;

    struct RewardInfo {
        uint256 amt;    // Total amount deposited by user
        uint256 redeemable;     // Total amount of KV2 user can redeem
        uint256 stake_time;     // Time of Stake/Redeem
        uint256 reward_per_share;   //
    }

    uint256 private RELEASE_RATE = 2000;   //0.05% per sec => lockup of 2000s
    uint256 private REWARD_RATE = 1;       //1 eth to 1 coin <-> 10**18
    mapping(address => RewardInfo) rewards;
    mapping(address => bool) claimantExists;
    IERC20 private _KV2;
    address _KV2Address = address(0x97Fd477e1893a2eEDcC7DEFE19fcDA7bF3EB6F1f);

    constructor() {
        _KV2 = IERC20(_KV2Address);
    }

    function deposit(uint256 amt,uint256 shares) public {
        address user_addr = _msgSender();
        if (claimantExists[user_addr] == false) {
            claimantExists[user_addr] = true;
            rewards[user_addr]  = RewardInfo(amt,0,block.timestamp,0);
        }
        rewards[user_addr].amt = rewards[user_addr].amt.add(amt);
        rewards[user_addr].stake_time = block.timestamp;
        rewards[user_addr].redeemable = rewards[user_addr].redeemable.add(calculate_reward(amt,shares));
        rewards[user_addr].reward_per_share = rewards[user_addr].redeemable.div(RELEASE_RATE); 
    }

    function calculate_current_redeemable() public view returns (uint256) {
        address user_addr = _msgSender();
        uint256 available_to_claim = rewards[user_addr].redeemable;
        uint256 can_claim_now = (block.timestamp - rewards[user_addr].stake_time).mul(rewards[user_addr].reward_per_share);
        if (available_to_claim > can_claim_now) {
            return can_claim_now;
        }
        else {
            return available_to_claim;
        }
    }

    // When user redeems KV2, It is transferred to the users acccount
    function redeem() public {
        address user_addr = _msgSender();
        uint256 can_claim_now = calculate_current_redeemable();
        _KV2.transfer(user_addr,can_claim_now);
        rewards[user_addr].redeemable = rewards[user_addr].redeemable.sub(can_claim_now);
        rewards[user_addr].stake_time = block.timestamp;
    }

    function withdraw() public {
        address user_addr = _msgSender();
        claimantExists[user_addr] = false;
        payable(user_addr).transfer(rewards[user_addr].amt);
        redeem();
    }

    function calculate_reward(uint256 amt,uint256 shares) public view returns (uint256) {
        uint256 reward_rate;
        if (shares < 20) {
            reward_rate = 6;
        }
        else if (shares < 50){
            reward_rate = 7;
        }
        else {
            reward_rate = 10;
        }
        return amt * reward_rate.div(10);  //TODO: implement quadaratic rewards here
    }
}
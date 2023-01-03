import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Elevator, ElevatorAttacker } from "typechain-types";

// Challenge description

// This elevator won't let you reach the top of your building. Right?

// Things that might help:
// Sometimes solidity is not good at keeping promises.
// This Elevator expects to be used from a Building.

describe("Ethernaut - Elevator", async () => {
  let elevator: Elevator;
  let elevatorAttacker: ElevatorAttacker;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    elevator = await ethers
      .getContractFactory("Elevator", owner)
      .then((f) => f.deploy());
    elevatorAttacker = await ethers
      .getContractFactory("ElevatorAttacker", attacker)
      .then((f) => f.deploy(elevator.address));
  });

  it("Hacks", async () => {
    await elevatorAttacker.connect(attacker).attack();

    expect(await elevator.floor()).equal(0);
    expect(await elevator.top()).equal(true);
  });
});

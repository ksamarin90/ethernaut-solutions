import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { GatekeeperTwo } from "typechain-types";

// Challenge description

// This gatekeeper introduces a few new challenges. Register as an entrant to pass this level.

// Things that might help:
// Remember what you've learned from getting past the first gatekeeper - the first gate is the same.
// The assembly keyword in the second gate allows a contract to access functionality that is not native
// to vanilla Solidity. See here for more information.
// The extcodesize call in this gate will get the size of a contract's code at a given address -
// you can learn more about how and when this is set in section 7 of the yellow paper.
// The ^ character in the third gate is a bitwise operation (XOR), and is used here to apply
// another common bitwise operation (see here). The Coin Flip level is also a good place to
// start when approaching this challenge.

describe("Ethernaut - GatekeeperTwo", async () => {
  let gatekeeperTwo: GatekeeperTwo;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    gatekeeperTwo = await ethers
      .getContractFactory("GatekeeperTwo", owner)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    await ethers
      .getContractFactory("GatekeeperTwoAttacker", attacker)
      .then((f) => f.deploy(gatekeeperTwo.address));

    expect(await gatekeeperTwo.entrant()).equal(attacker.address);
  });
});

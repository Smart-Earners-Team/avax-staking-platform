import BigNumber from "bignumber.js";
import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import getGasPrice from "utils/getGasPrice";
import { ASP_DECIMALS } from "config/constants";
import { BIG_TEN } from "utils/bigNumber";

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
};

export const stakePool = async (
  contract: Contract,
  amount: string,
  days: string
) => {
  const value = new BigNumber(amount)
    .times(BIG_TEN.pow(ASP_DECIMALS))
    .toFixed()
    .toString();

  const tx = await contract.stakeStart(value, days);
  const receipt = await tx.wait();
  return receipt.status;
};

export const unstakePool = async (
  contract: Contract,
  pid: number,
  index: number
) => {
  const tx = await contract.stakeEnd(index, pid);
  const receipt = await tx.wait();
  return receipt.status;
};

export const harvestFarm = async (krlContract: Contract, pid: number) => {
  const gasPrice = getGasPrice();
  if (pid === 0) {
    const tx = await krlContract.leaveStaking("0", { ...options, gasPrice });
    const receipt = await tx.wait();
    return receipt.status;
  }

  const tx = await krlContract.getReward();
  const receipt = await tx.wait();
  return receipt.status;
};

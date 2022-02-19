import BigNumber from "bignumber.js";
import { Contract } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { BIG_TEN } from "utils/bigNumber";
import { getAspContract } from "utils/contractHelpers";

/**
 * Get the current day from the start contract in index 0.
 * @returns number
 */
export const getCurrentDay = async () => {
  const contract = await getAspContract();
  const day = await contract.currentDay();
  return { value: day.toNumber() + 1, index: day.toNumber() } as {
    value: number;
    index: number;
  };
};

export const enterAuctionLobby = async (
  contract: Contract,
  amount: string,
  referrer: string
) => {
  const value = new BigNumber(amount)
    .times(BIG_TEN.pow(18))
    .toFixed()
    .toString();
  const ref = isAddress(referrer) ? referrer : "";
  const tx = await contract.xfLobbyEnter(ref, { value: value });
  const receipt = await tx.wait();
  return receipt.status;
};

export const exitAuctionLobby = async (
  contract: Contract,
  enterDay: number,
  count: number
) => {
  try {
    const tx = await contract.xfLobbyExit(
      enterDay.toString(),
      count.toString()
    );
    const receipt = await tx.wait();
    return receipt.status;
  } catch (error) {
    throw error;
  }
};

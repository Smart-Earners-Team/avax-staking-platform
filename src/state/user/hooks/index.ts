import BigNumber from "bignumber.js";
import { ethers } from "ethers";

export const fetchUserTokenBalance = async (
  account: string,
  contract: ethers.Contract
) => {
  const rawTokenBalance = await contract.balanceOf(account);
  return new BigNumber(rawTokenBalance._hex).toJSON();
};

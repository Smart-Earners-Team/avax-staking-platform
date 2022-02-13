import BigNumber from "bignumber.js";
import { getAspContract } from "utils/contractHelpers";
import { ethers, Signer } from "ethers";
import { ASP_DECIMALS } from "config/constants";
import { BIG_TEN } from "utils/bigNumber";

export const fetchUserPoolsData = async (
  account: string,
  signer: Signer | ethers.providers.Provider,
  stakeIndexs: number[]
) => {
  const userData = await Promise.all(
    stakeIndexs.map(async (i) => {
      const {
        stakeId,
        stakedSuns,
        stakeShares,
        lockedDay,
        stakedDays,
        unlockedDay,
      } = await getAspContract(signer).stakeLists(account, i);

      const progress = ((stakedDays - 1) / stakedDays) * 100;

      return {
        stakeId,
        stakedSuns: new BigNumber(stakedSuns._hex)
          .div(BIG_TEN.pow(ASP_DECIMALS))
          .toJSON(),
        stakeShares: new BigNumber(stakeShares._hex)
          .div(BIG_TEN.pow(ASP_DECIMALS))
          .toJSON(),
        lockedDay,
        stakedDays,
        unlockedDay,
        progress,
      };
    })
  );

  return userData;
};

export const fetchPoolUserStakeCount = async (
  account: string,
  signer: Signer | ethers.providers.Provider
) => {
  const rawStakeCount = await getAspContract(signer).stakeCount(account);
  return new BigNumber(rawStakeCount._hex).toNumber();
};

import BigNumber from "bignumber.js";
import { getAspContract } from "utils/contractHelpers";
import { ethers, Signer } from "ethers";
import { BIG_TEN } from "utils/bigNumber";

export const fetchUserAuctionsData = async (
  account: string,
  dayIndexs: number[],
  signer: Signer | ethers.providers.Provider
) => {
  const userData = await Promise.all(
    dayIndexs.map(async (i) => {
      const day = i.toString();
      // get the amount of avax staked for this day
      const { rawAmount/* , referrerAddr  */} = await getAspContract(
        signer
      ).xfLobbyEntry(account, day, 0);
      const avaxAmount = new BigNumber(rawAmount._hex).div(BIG_TEN.pow(18));
      
     // get the total ppol
     const rawPoolAmount = await getAspContract(signer).xfLobby(0);
     const pool = new BigNumber(rawPoolAmount._hex).div(BIG_TEN.pow(18));
     const state = true;

      return {
        day: 1,
        pool: pool.toJSON(),
        state: state,
        recieve: 24,
        entry: avaxAmount.toJSON()
      };
    })
  );

  return userData;
};

export const fetchDayAuctionCount = async (
  account: string,
  day: string,
  signer: Signer | ethers.providers.Provider
) => {
  const {/*  headIndex, */ tailIndex } = await getAspContract(signer).xfLobbyMembers(
    day,
    account
  );
  return tailIndex as number;
};

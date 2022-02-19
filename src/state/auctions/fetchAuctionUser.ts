import BigNumber from "bignumber.js";
import { getAspContract } from "utils/contractHelpers";
import { ethers, Signer } from "ethers";
import { BIG_TEN } from "utils/bigNumber";
import spreadToArray from "utils/spreadNumberToArray";

export const fetchAuctionUser = async (
  account: string,
  dayIndexs: number[],
  signer: Signer | ethers.providers.Provider
) => {
  const userData = await Promise.all(
    dayIndexs.map(async (i) => {
      const day = i.toString();
      // get total auction count and index
      const auctionIndexs = await fetchDayAuctionCount(account, day);

      // get the amount of avax staked for this day
      // get total lobby entries for that day... wait I do not think one can enter more than once
      const entrySum = spreadToArray(auctionIndexs).reduce(
        async (amount, index) => {
          const amt = await amount;
          const { rawAmount /* , referrerAddr  */ } = await getAspContract(
            signer
          ).xfLobbyEntry(account, day, index.toString()); // account, day,
          return new BigNumber(rawAmount._hex).plus(amt).toNumber();
        },
        (async () => 0)()
      );
      const totalEntry = await entrySum;
      const avaxAmount = new BigNumber(totalEntry).div(BIG_TEN.pow(18));

      return {
        id: i,
        auctionIndexs: spreadToArray(auctionIndexs),
        rewards: "0",
        entry: avaxAmount.toJSON(),
      };
    })
  );

  return userData;
};

export const fetchDayAuctionCount = async (account: string, day: string) => {
  const { /*  headIndex, */ tailIndex } = await getAspContract().xfLobbyMembers(
    day,
    account
  );
  return tailIndex as number;
};

import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import { getCurrentDay } from "utils/calls";
import { getAspContract } from "utils/contractHelpers";
import spreadToArray from "utils/spreadNumberToArray";

type PublicAuctionData = {
  id: number;
  pool: SerializedBigNumber;
  ended: boolean;
  aspPerAvax: SerializedBigNumber;
};
const fetchAuction = async (id: number): Promise<PublicAuctionData> => {
  const aspContract = getAspContract();
  const pool = await aspContract.xfLobby(id.toString());
  const currentDay = await getCurrentDay();
  const daysTillPresent = spreadToArray(currentDay.value);
  const ended = daysTillPresent[id] < currentDay.index;
  // get ASP recieved per AVAX staked
  // calculated as nextStakeSharesTotal/lockedSunsTotal
  const /* global */ { nextStakeSharesTotal, lockedSunsTotal } =
      await aspContract.globals();

  const aspPerAvax = new BigNumber(nextStakeSharesTotal._hex).div(
    new BigNumber(lockedSunsTotal._hex)
  );
  return {
    id,
    pool: new BigNumber(pool._hex).div(BIG_TEN.pow(18)).toJSON(),
    ended,
    aspPerAvax: aspPerAvax.toFixed(4).toString(),
  };
};

export default fetchAuction;

import BigNumber from "bignumber.js";
import { getAspContract } from "./contractHelpers";

type GlobalsData = {
  lockedSunsTotal: BigNumber;
  nextStakeSharesTotal: BigNumber;
  shareRate: number;
  stakePenaltyTotal: BigNumber;
  dailyDataCount: number;
  stakeSharesTotal: BigNumber;
  latestStakeId: number;
};

export const fetchGlobalData = async () => {
  const {
    dailyDataCount,
    latestStakeId,
    shareRate,
    lockedSunsTotal,
    nextStakeSharesTotal,
    stakePenaltyTotal,
    stakeSharesTotal,
  } = await getAspContract().globals();
  return {
    dailyDataCount,
    latestStakeId,
    shareRate,
    lockedSunsTotal: new BigNumber(lockedSunsTotal._hex),
    nextStakeSharesTotal: new BigNumber(nextStakeSharesTotal._hex),
    stakePenaltyTotal: new BigNumber(stakePenaltyTotal._hex),
    stakeSharesTotal: new BigNumber(stakeSharesTotal._hex),
  } as GlobalsData;
};

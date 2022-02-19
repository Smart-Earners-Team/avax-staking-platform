import BigNumber from "bignumber.js";
import { getAspContract } from "utils/contractHelpers";
import { ASP_DECIMALS } from "config/constants";
import { BIG_TEN } from "utils/bigNumber";
import { getCurrentDay } from "utils/calls";
import { clampNumber } from "utils";
import { fetchGlobalData } from "utils/poolHelpers";

interface FetchUserResponse {
  stakeId: number;
  index: number;
  stakedSuns: SerializedBigNumber;
  stakeShares: SerializedBigNumber;
  dividends: SerializedBigNumber;
  paidAmount: SerializedBigNumber;
  lockedDay: number;
  stakedDays: number;
  unlockedDay: number;
  progress: number | undefined;
}

export const fetchUserPoolsData = async (
  account: string,
  stakeIndexs: number[]
): Promise<FetchUserResponse[]> => {
  const userData = await Promise.all(
    stakeIndexs.map(async (i) => {
      const {
        stakeId,
        stakedSuns,
        stakeShares,
        lockedDay,
        stakedDays,
        unlockedDay,
      } = await getAspContract().stakeLists(account, i);
      // get current day
      const currentDay = await getCurrentDay();
      // Progress as a percentage = [(Unlocked day-lockedDay)/stakedDays] × 100
      // if unloc
      const p = (currentDay.value / (lockedDay + stakedDays)) * 100;
      const progress = clampNumber(p, 0, 100);
      const { dayDividends } = await fetchDailyData(i);
      const dividends = dayDividends.toString();
      // calculated based on the total staked suns of an individual as a percentage
      // of the nextStakeSharesTotal
      const test = await fetchGlobalData();
      const paidAmount = new BigNumber(stakedSuns._hex)
        .div(test.nextStakeSharesTotal)
        .times(100)
        .toFixed(4);

      return {
        stakeId,
        index: i,
        stakedSuns: new BigNumber(stakedSuns._hex)
          .div(BIG_TEN.pow(ASP_DECIMALS))
          .toFixed(4),
        stakeShares: new BigNumber(stakeShares._hex)
          .div(BIG_TEN.pow(ASP_DECIMALS))
          .toFixed(4),
        lockedDay,
        stakedDays,
        unlockedDay,
        progress,
        dividends,
        paidAmount,
      };
    })
  );

  return userData;
};

export const fetchPoolUserStakeCount = async (account: string) => {
  const rawStakeCount = await getAspContract().stakeCount(account);
  return new BigNumber(rawStakeCount._hex).toNumber();
};

type DailyData = {
  dayPayoutTotal: number;
  dayDividends: number;
  dayStakeSharesTotal: number;
};

export const fetchDailyData = async (day: number): Promise<DailyData> => {
  const dailyData = await getAspContract().dailyData(day);
  return dailyData as DailyData;
};

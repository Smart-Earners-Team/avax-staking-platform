import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import { getAspAddress } from "utils/addressHelpers";
import { BIG_TEN } from "utils/bigNumber";
import multicall from "utils/multicall";

type PublicFarmData = {
  tokenTotalSupply: SerializedBigNumber;
};

const fetchPool = async (): Promise<PublicFarmData> => {
  const aspAddress = getAspAddress();

  const Erc20calls = [
    
    // Total supply of tokens
    {
      address: aspAddress,
      name: "totalSupply",
    },
    // Token decimals
    {
      address: aspAddress,
      name: "decimals",
    }
  ];
/* 
  const aspCalls = [
    // Rewards per token stored
    {
      address: krlAddress,
      name: "rewardPerToken",
      params: [token.address]
    },
    // Get reward for duration
    {
      address: krlAddress,
      name: "getRewardForDuration",
      params: [token.address]
    },
    // Reward data / see abi or sm for return values
    {
      address: krlAddress,
      name: "rewardData",
      params: [token.address]
    }
  ] */

  const [
    tokenTotalSupply,
    tokenDecimals
  ] = await multicall(erc20, Erc20calls);

  // const [rewardPerToken, rewardForDuration, rewardData] = await multicall(krlAbi, krlCalls);

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  /* const lpTokenRatio = new BigNumber(tokenBalance).div(
    new BigNumber(tokenTotalSupply)
  ); */

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenTotalSupply).div(
    BIG_TEN.pow(tokenDecimals)
  );

  return {
    tokenTotalSupply: tokenAmountTotal.toJSON(),
  };
};

export default fetchPool;

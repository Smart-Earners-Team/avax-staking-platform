import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import BigNumber from "bignumber.js";
// import { BIG_ZERO } from "utils/bigNumber";
// import { useAppDispatch } from "state";
// import useRefresh from "hooks/useRefresh";
// import { fetchPoolsUserDataAsync } from ".";
// import {
//   DeserializedPoolsState,
//   DeserializedPoolUserData,
//   SerializedPoolUserData,
//   State,
// } from "state/types-pool";
// import useActiveWeb3React from "hooks/useActiveWeb3React";
// import { Contract } from "@ethersproject/contracts";
// import { unstakePool } from "utils/calls";

// const deserializePoolUserData = (
//   pool: SerializedPoolUserData
// ): DeserializedPoolUserData => {
//   return {
//     pid: Number(pool.pid),
//     index: pool.index,
//     startDay: pool ? new BigNumber(pool.startDay) : BIG_ZERO,
//     endDay: pool ? new BigNumber(pool.endDay) : BIG_ZERO,
//     progress: pool ? Number(pool.progress) : 0,
//     stakedAmount: pool ? new BigNumber(pool.stakedAmount) : BIG_ZERO,
//     shares: pool ? new BigNumber(pool.shares) : BIG_ZERO,
//     dividends: pool ? new BigNumber(pool.dividends) : BIG_ZERO,
//     bonus: pool ? new BigNumber(pool.bonus) : BIG_ZERO,
//     paidAmount: pool ? new BigNumber(pool.paidAmount) : BIG_ZERO,
//     daysToStake: pool ? new BigNumber(pool.daysToStake) : BIG_ZERO,
//     action: (contract: Contract) => unstakePool(contract, pool.pid, pool.index)
//   };
// };

// const deserializePool = (
//   pool: SerializedPoolUserData
// ): DeserializedPoolUserData => {
//   return deserializePoolUserData(pool);
// };

// export const usePools = (): DeserializedPoolsState => {
//   const pools = useSelector((state: State) => state.pools);
//   const deserializedPoolsData = pools.data.map(deserializePool);
//   const { userDataLoaded } = pools;
//   return {
//     userDataLoaded,
//     data: deserializedPoolsData,
//   };
// };

// export const usePoolFromPid = (
//   pid: number
// ): DeserializedPoolUserData | undefined => {
//   const pool = useSelector((state: State) =>
//     state.pools.data.find((f) => f.pid === pid)
//   );
//   return pool ? deserializePool(pool) : undefined;
// };

// export const usePoolUser = (
//   pid: number
// ): DeserializedPoolUserData | undefined => {
//   const pool = usePoolFromPid(pid);

//   return pool ? pool : undefined;
// };

// export const usePoolsWithUserData = () => {
//   const dispatch = useAppDispatch();
//   const { slowRefresh } = useRefresh();
//   const { account, library } = useActiveWeb3React();

//   useEffect(() => {
//     // dispatch(fetchPoolsPublicDataAsync(pids));
//     if (account && library) {
//         dispatch(
//           fetchPoolsUserDataAsync({
//             account,
//             signer: library.getSigner(),
//             [0]
//           })
//         );
//     }
//   }, [dispatch, slowRefresh, account, library]);
// };

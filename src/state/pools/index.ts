import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { SerializedPoolsState } from "state/types-pool";
import { fetchUserPoolsData } from "./fetchPoolUser";

const initialState: SerializedPoolsState = {
  data: [],
  userDataLoaded: false,
};
/* 
// Async thunks
export const fetchPoolsPublicDataAsync = createAsyncThunk<
  SerializedPool[],
  number[]
>("pools/fetchPoolPublicDataAsync", async (pids) => {
  const poolsToFetch = pools.filter((poolConfig) =>
    pids.includes(poolConfig.pid)
  );
  const result = await fetchPools(poolsToFetch);
  return result;
}); */

interface PoolUserDataResponse {
  pid: number;
  startDay: SerializedBigNumber;
  endDay: SerializedBigNumber;
  progress: number;
  stakedAmount: SerializedBigNumber;
  shares: SerializedBigNumber;
  dividends: SerializedBigNumber;
  bonus: SerializedBigNumber;
  paidAmount: SerializedBigNumber;
  daysToStake: SerializedBigNumber;
}

export const fetchPoolsUserDataAsync = createAsyncThunk<
  PoolUserDataResponse[],
  {
    account: string;
    signer: ethers.Signer | ethers.providers.Provider;
    stakeIndexs: number[];
  }
>("pools/fetchUserDataAsync", async ({ account, signer, stakeIndexs }) => {
  const fetchedPools = await fetchUserPoolsData(account, signer, stakeIndexs);

  return stakeIndexs.map((e, index) => {
    return {
      pid: fetchedPools[index].stakeId,
      startDay: "1",
      endDay: (fetchedPools[index].stakedDays - 1).toString(),
      progress: fetchedPools[index].progress,
      stakedAmount: fetchedPools[index].stakedSuns,
      shares: fetchedPools[index].stakeShares,
      dividends: "8833",
      bonus: "976",
      paidAmount: "738",
      daysToStake: fetchedPools[index].stakedDays,
    };
  });
});

export const poolsSlice = createSlice({
  name: "Pools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update pools with live data
    /* builder.addCase(fetchPoolsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((pool) => {
        const livePoolData = action.payload.find(
          (poolData) => poolData.pid === pool.pid
        );
        return { ...pool, ...livePoolData };
      });
    }); */

    // Update pools with user data
    builder.addCase(fetchPoolsUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl;
        if (state.data.length > 0) {
          state.data[pid] = { ...state.data[pid], ...userDataEl };
        } else {
          state.data[pid] = { ...userDataEl };
        }
        state.userDataLoaded = true;
      });
    });
  },
});

export default poolsSlice.reducer;

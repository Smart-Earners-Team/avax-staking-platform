import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { SerializedPoolsState } from "state/types-pool";
import { fetchUserPoolsData } from "./fetchPoolUser";

const initialState: SerializedPoolsState = {
  data: [],
  userDataLoaded: false,
};

interface PoolUserDataResponse {
  pid: number;
  index: number;
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

  return stakeIndexs.map((stakeIndex, index) => {
    return {
      pid: fetchedPools[index].stakeId,
      index: stakeIndex,
      startDay: "1",
      endDay: (fetchedPools[index].stakedDays + 1).toString(),
      progress: fetchedPools[index].progress,
      stakedAmount: fetchedPools[index].stakedSuns,
      shares: fetchedPools[index].stakeShares,
      dividends: "0",
      bonus: "0",
      paidAmount: "0",
      daysToStake: fetchedPools[index].stakedDays,
    };
  });
});

export const poolsSlice = createSlice({
  name: "Pools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update pools with user data
    builder.addCase(fetchPoolsUserDataAsync.fulfilled, (state, action) => {
      if (action.payload.length === 0) {
        state.data = [];
        state.userDataLoaded = true;
        return;
      }
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl;
        if (state.data.length > 0 && state.data[pid]) {
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

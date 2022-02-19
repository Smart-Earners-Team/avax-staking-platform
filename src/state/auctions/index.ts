import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers, Signer } from "ethers";
import { SerializedAuction } from "state/types";
import { SerializedAuctionsState } from "state/types-pool";
import fetchAuctions from "./fetchAuctions";
import { fetchAuctionUser } from "./fetchAuctionUser";

const initialState: SerializedAuctionsState = {
  data: [],
  userDataLoaded: false,
};

// Async thunks
export const fetchAuctionsPublicDataAsync = createAsyncThunk<
  SerializedAuction[],
  number[]
>("auctions/fetchAuctionsPublicDataAsync", async (ids) => {
  // fetch auctions
  const auctions = await fetchAuctions(ids);
  return auctions;
});

interface AuctionUserDataResponse {
  id: number;
  auctionIndexs: number[];
  rewards: SerializedBigNumber;
  entryAmount: SerializedBigNumber;
}

export const fetchAuctionUserDataAsync = createAsyncThunk<
  AuctionUserDataResponse[],
  { account: string; ids: number[]; signer: Signer | ethers.providers.Provider }
>("auctions/fetchAuctionUserDataAsync", async ({ account, ids, signer }) => {
  const userAuctions = await fetchAuctionUser(account, ids, signer);

  return userAuctions.map((auction) => {
    return {
      id: auction.id,
      auctionIndexs: auction.auctionIndexs,
      rewards: auction.rewards,
      entryAmount: auction.entry,
    };
  });
});

export const auctionsSlice = createSlice({
  name: "Auctions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update auctions with live data
    builder.addCase(fetchAuctionsPublicDataAsync.fulfilled, (state, action) => {
      if (action.payload.length === 0) {
        state.data = [];
        return;
      }
      action.payload.forEach((userDataEl) => {
        const { id } = userDataEl;
        if (state.data.length > 0 && state.data[id]) {
          state.data[id] = { ...state.data[id], ...userDataEl };
        } else {
          state.data[id] = { ...userDataEl };
        }
      });
    });

    // Update auctions with user data
    builder.addCase(fetchAuctionUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { id, ...rest } = userDataEl;
        const index = state.data.findIndex((auctions) => auctions.id === id);
        state.data[index] = { ...state.data[index], userData: rest };
      });
      state.userDataLoaded = true;
    });
  },
});

export default auctionsSlice.reducer;

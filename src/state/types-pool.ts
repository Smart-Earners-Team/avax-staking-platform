import BigNumber from "bignumber.js";
export type SerializedBigNumber = string;

export interface SerializedPoolsState {
  data: SerializedPoolUserData[];
  userDataLoaded: boolean;
}

export interface SerializedPoolUserData {
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

export interface DeserializedPoolUserData {
  pid: number;
  startDay: BigNumber;
  endDay: BigNumber;
  progress: number;
  stakedAmount: BigNumber;
  shares: BigNumber;
  dividends: BigNumber;
  bonus: BigNumber;
  paidAmount: BigNumber;
  daysToStake: BigNumber;
}

export interface DeserializedPoolsState {
  data: DeserializedPoolUserData[];
  userDataLoaded: boolean;
}

// Global state

export interface State {
  pools: SerializedPoolsState;
}

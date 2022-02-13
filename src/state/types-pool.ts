import BigNumber from "bignumber.js";
import { Contract } from "@ethersproject/contracts";
export type SerializedBigNumber = string;

export interface SerializedPoolsState {
  data: SerializedPoolUserData[];
  userDataLoaded: boolean;
}

export interface SerializedPoolUserData {
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

export interface DeserializedPoolUserData extends PoolActionHelpers {
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

interface PoolActionHelpers {
  index: number;
  action: (contract: Contract) => Promise<any>;
}
export interface DeserializedPoolsState {
  data: DeserializedPoolUserData[];
  userDataLoaded: boolean;
}

// Global state

export interface State {
  pools: SerializedPoolsState;
}

import {
  DeserializedAuctionUserData,
  SerializedAuctionUserData,
} from "./types-pool";

export type SerializedBigNumber = string;

export interface SerializedAuction {
  id: number;
  pool: SerializedBigNumber;
  ended: boolean;
  aspPerAvax: SerializedBigNumber;
  userData?: SerializedAuctionUserData;
}

export interface DeserializedAuction {
  id: number;
  pool: SerializedBigNumber;
  ended: boolean;
  aspPerAvax: SerializedBigNumber;
  action: "enter" | "exit" | "ended";
  userData: DeserializedAuctionUserData;
}

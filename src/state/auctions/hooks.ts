import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import useRefresh from "hooks/useRefresh";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { getCurrentDay } from "utils/calls";
import { fetchAuctionsPublicDataAsync, fetchAuctionUserDataAsync } from ".";
import spreadToArray from "utils/spreadNumberToArray";
import {
  DeserializedAuctionsState,
  DeserializedAuctionUserData,
  State,
} from "state/types-pool";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import { DeserializedAuction, SerializedAuction } from "state/types";

const deserializeAuctionUserData = (
  auction: SerializedAuction
): DeserializedAuctionUserData => {
  return {
    auctionIndexs: auction.userData ? auction.userData.auctionIndexs : [],
    rewards: auction.userData
      ? new BigNumber(auction.userData.rewards)
      : BIG_ZERO,
    entryAmount: auction.userData
      ? new BigNumber(auction.userData.entryAmount)
      : BIG_ZERO,
  };
};

const deserializeAuction = (
  auction: SerializedAuction
): DeserializedAuction => {
  const { id, ended, pool, aspPerAvax, userData } = auction;
  const action = ended
    ? "ended"
    : /* User entered*/ userData && userData.auctionIndexs.length > 0
    ? "exit"
    : "enter";

  return {
    id,
    pool,
    ended,
    action,
    aspPerAvax,
    userData: deserializeAuctionUserData(auction),
  };
};

export const useAuctions = (): DeserializedAuctionsState => {
  const auction = useSelector((state: State) => state.auctions);
  const deserializedAuctionsData = auction.data.map(deserializeAuction);
  const { userDataLoaded } = auction;
  return {
    userDataLoaded,
    data: deserializedAuctionsData,
  };
};

export const useAuctionFromid = (
  id: number
): DeserializedAuction | undefined => {
  const auction = useSelector((state: State) =>
    state.auctions.data.find((a) => a.id === id)
  );
  return auction ? deserializeAuction(auction) : undefined;
};

export const useAuctionUser = (id: number): DeserializedAuction | undefined => {
  const pool = useAuctionFromid(id);
  return pool ? pool : undefined;
};

export const useAuctionsWithUserData = () => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  const { account, library } = useActiveWeb3React();

  useEffect(() => {
    const autionCount = getCurrentDay();
    autionCount
      .then((count) => {
        const ids = spreadToArray(count.value);
        dispatch(fetchAuctionsPublicDataAsync(ids));

        //fetch user data if wallet is connected
        if (account && library) {
          // get stake counts
          dispatch(
            fetchAuctionUserDataAsync({
              account,
              ids,
              signer: library.getSigner(),
            })
          );
        }
      })
      .catch((e) => {});
  }, [dispatch, slowRefresh, account, library]);
};

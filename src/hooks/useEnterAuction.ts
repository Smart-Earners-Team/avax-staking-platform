import { useCallback } from "react";
import { useAspContract } from "hooks/useContract";
import { enterAuctionLobby } from "utils/calls";

const useEnterAuction = () => {
  const contract = useAspContract();

  const handleStake = useCallback(
    async (amount: string, referrer: string) => {
      if (!contract) return;
      await enterAuctionLobby(contract, amount, referrer);
    },
    [contract]
  );

  return { onEnter: handleStake };
};

export default useEnterAuction;

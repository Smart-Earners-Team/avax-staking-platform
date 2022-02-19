import { useCallback } from "react";
import { useAspContract } from "hooks/useContract";
import { exitAuctionLobby } from "utils/calls";

const useExitAuction = () => {
  const contract = useAspContract();

  const handleStake = useCallback(
    async (enterDay: number, count: number) => {
      if (!contract) return;
      await exitAuctionLobby(contract, enterDay, count);
    },
    [contract]
  );

  return { onExit: handleStake };
};

export default useExitAuction;

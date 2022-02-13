import { useCallback } from "react";
import { stakePool } from "utils/calls";
import { useAspContract } from "hooks/useContract";

const useStakePools = () => {
  const contract = useAspContract();

  const handleStake = useCallback(
    async (amount: string, days: string) => {
      await stakePool(contract, amount, days);
    },
    [contract]
  );

  return { onStake: handleStake };
};

export default useStakePools;

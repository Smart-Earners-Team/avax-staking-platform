import { useCallback } from "react";
import { unstakePool } from "utils/calls";
import { useAspContract } from "hooks/useContract";

const useUnstakeFarms = (pid: number, index: number) => {
  const contract = useAspContract();

  const handleUnstake = useCallback(
    async () => {
      await unstakePool(contract, pid, index);
    },
    [contract, pid, index]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakeFarms;

import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { getBep20Contract, getAspContract } from "utils/contractHelpers";

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getBep20Contract(address, library?.getSigner()),
    [address, library]
  );
};

export const useAspContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getAspContract(library?.getSigner()), [library]);
};

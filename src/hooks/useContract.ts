import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { getAspContract } from "utils/contractHelpers";
import { Contract } from "ethers";

export const useAspContract = () => {
  const { library } = useActiveWeb3React();
  let f: Contract | null = null;
  const contract = useMemo(
    () => getAspContract(library?.getSigner()),
    [library]
  );
  if (library) {
    return (f = contract);
  } else {
    return (f = null);
  }
};

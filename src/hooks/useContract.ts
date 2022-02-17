import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { getAspContract } from "utils/contractHelpers";

export const useAspContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getAspContract(library?.getSigner()), [library]);
};

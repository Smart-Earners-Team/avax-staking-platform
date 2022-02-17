import { ethers } from "ethers";
import { getAspAddress } from "./addressHelpers";
import aspAbi from "config/abi/asp.json";
import { simpleRpcProvider } from "./providers";

export const getContract = (
  abi: any,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider | undefined
) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider);
};

// Who is master chef?
export const getAspContract = (
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(aspAbi, getAspAddress(), signer);
};

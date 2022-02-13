import { ethers } from "ethers";
import { getAspAddress, getMulticallAddress } from "./addressHelpers";
// ABI
import bep20Abi from "config/abi/erc20.json";
import MultiCallAbi from "config/abi/Multicall.json";
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

export const getBep20Contract = (
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(bep20Abi, address, signer);
};

// Who is master chef?
export const getAspContract = (
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(aspAbi, getAspAddress(), signer);
};

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
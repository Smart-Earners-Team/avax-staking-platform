import BigNumber from "bignumber.js";
import { ChainId } from "config/constants";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { AppState } from "state";
import { GAS_PRICE_GWEI } from "./helpers";

export function useGasPrice(): string {
  const chainId = process.env.REACT_APP_CHAIN_ID!;
  const userGas = useSelector<AppState, AppState["user"]["gasPrice"]>(
    (state) => state.user.gasPrice
  );
  return chainId === ChainId.MAINNET.toString()
    ? userGas
    : GAS_PRICE_GWEI.testnet;
}

export const fetchUserTokenBalance = async (
  account: string,
  contract: ethers.Contract
) => {
  const rawTokenBalance = await contract.balanceOf(account);
  return new BigNumber(rawTokenBalance._hex).toJSON();
};

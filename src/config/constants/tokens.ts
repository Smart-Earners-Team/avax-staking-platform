import { Token } from "config/entities/token";
import { serializeToken } from "state/user/hooks/helpers";
import { ChainId } from "./";
import { SerializedToken } from "./types";

const { MAINNET } = ChainId;

type TokenList = {
  [key in keyof typeof mainnetTokens]: Token;
};

interface SerializedTokenList {
  [symbol: string]: SerializedToken;
}

export const mainnetTokens = {
  asp: new Token(
    MAINNET,
    "0xb3127298c77B6d389217d985F4B7197388334df4",
    8,
    "ASP",
    "ASP",
    "https://aspstake.io"
  ),
};

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID!;

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      const index = key as keyof TokenList;
      return { ...accum, [key]: mainnetTokens[index] } as TokenList;
    }, {} as TokenList);
  }

  return mainnetTokens;
};

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens();
  const serializedTokens = Object.keys(unserializedTokens).reduce(
    (accum, key) => {
      const index = key as keyof TokenList;
      return { ...accum, [key]: serializeToken(unserializedTokens[index]) };
    },
    {}
  );

  return serializedTokens;
};

export default tokens();

import { BASE_BSC_SCAN_URL } from 'config/constants';

import getRpcUrl from "./getRpcUrl";

/**
 * Prompt the user to add Avalanche as a network on Metamask, or switch to Avalanche if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID!, 10);
    try {
      if (!provider.request) throw new Error("Can't setup the Avalanche network on metamask because window.ethereum.request is undefined");

      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: "Avalanche Network",
            nativeCurrency: {
              name: "Avalanche",
              symbol: "AVAX",
              decimals: 18,
            },
            rpcUrls: [getRpcUrl()],
            blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the Avalanche network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

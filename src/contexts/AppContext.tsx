import React, { useEffect, useState, createContext } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import connectorList, { resetWalletConnectConnector } from "../lib/connectors";
import { ethers } from "ethers";
import { formatFixedNumber } from "utils/formatBalance";
import { useEagerConnect } from "hooks/useEagerConnect";
import { useInactiveListener } from "hooks/useInactiveListener";
import { fetchUserTokenBalance } from "state/user/hooks";
import { getAspContract } from "utils/contractHelpers";

export interface GlobalAppContext {
  aspWallet: {
    active: boolean;
    balance: string;
    isConnecting: boolean;
    error: Error | undefined;
    retry: () => void;
  }
}

const defaultValues: GlobalAppContext = {
  aspWallet: {
    active: false,
    balance: "0.000",
    isConnecting: true,
    error: undefined,
    retry: () => {},
  },
};

export const GlobalAppContextProvider =
  createContext<GlobalAppContext>(defaultValues);

export default function AppContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { account, deactivate, active, error, library } = useActiveWeb3React();
  // get wallet balance in bnb
  const [balance, setBalance] = useState("0.000");

  useEffect(() => {
    if (active) {
      setIsConnecting(true);
    } else {
      setIsConnecting(false);
    }
  }, [active, error]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  useEffect(() => {
    if (account && library) {
      (async () => {
        const bal = await fetchUserTokenBalance(account, getAspContract(library.getSigner()));
        setBalance(formatFixedNumber(ethers.FixedNumber.from(bal), 8));
      })();
    } else {
      setBalance("0.000");
    }
  }, [account, library])
  

  const handleRetry = () => {
    setIsConnecting(false);
    resetWalletConnectConnector(connectorList["WalletConnect"]);
    deactivate();
  };

  return (
    <GlobalAppContextProvider.Provider
      value={{
        aspWallet: {
          active,
          balance: balance,
          isConnecting,
          error,
          retry: handleRetry,
        },
      }}
    >
      {children}
    </GlobalAppContextProvider.Provider>
  );
}

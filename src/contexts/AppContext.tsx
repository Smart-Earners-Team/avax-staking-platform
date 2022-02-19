import React, { useEffect, useState, createContext } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import connectorList, { resetWalletConnectConnector } from "../lib/connectors";
import { ethers } from "ethers";
import { formatFixedNumber } from "utils/formatBalance";
import { useEagerConnect } from "hooks/useEagerConnect";
import { useInactiveListener } from "hooks/useInactiveListener";
import { fetchUserTokenBalance } from "state/user/hooks";
import { getAspContract } from "utils/contractHelpers";
import useQuery from "hooks/useQuery";
import { getCurrentDay } from "utils/calls";

export interface GlobalAppContext {
  aspWallet: {
    active: boolean;
    balance: string;
    bnbBalance: string;
    isConnecting: boolean;
    error: Error | undefined;
    retry: () => void;
  };
  refAddress: string;
  currentDay: {value: number; index: number} | undefined;
}

const defaultValues: GlobalAppContext = {
  aspWallet: {
    active: false,
    balance: "0.000",
    bnbBalance: "0.000",
    isConnecting: true,
    error: undefined,
    retry: () => {},
  },
  refAddress: "",
  currentDay: undefined,
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
  const [bnbBal, setBnbBal] = useState("0.000");
  const [ref, setRef] = useState("");
  const [currentDay, setCurrentDay] = useState<{value: number; index: number}>();
  // Get referral address
  const address = useQuery().get("ref");

  // get and set the current day
  useEffect(() => {
    (async () => {
      const day = await getCurrentDay();
      setCurrentDay(day);
    })();
  }, []);

  useEffect(() => {
    if (active) {
      setIsConnecting(true);
    } else {
      setIsConnecting(false);
    }
  }, [active, error]);

  useEffect(() => {
    if (address) {
      setRef(address);
    }
  }, []);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  useEffect(() => {
    if (account && library) {
      (async () => {
        const bal = await fetchUserTokenBalance(
          account,
          getAspContract(library.getSigner())
        );
        const bnb = await library.getBalance(account);
        setBalance(formatFixedNumber(ethers.FixedNumber.from(bal), 4));
        setBnbBal(formatFixedNumber(ethers.FixedNumber.from(bnb), 4, 18));
      })();
    } else {
      setBalance("0.000");
      setBnbBal("0.000");
    }
  }, [account, library]);

  useEffect(() => {
    if (account && library) {
      (async () => {
        const bnb = await library.getBalance(account);
        setBnbBal(formatFixedNumber(ethers.FixedNumber.from(bnb), 4, 18));
      })();
    } else {
      setBnbBal("0.000");
    }
  });

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
          bnbBalance: bnbBal,
          isConnecting,
          error,
          retry: handleRetry,
        },
        refAddress: ref,
        currentDay,
      }}
    >
      {children}
    </GlobalAppContextProvider.Provider>
  );
}

import React from "react";
import { useAppContext } from "hooks/useAppContext";
import Button, { ButtonProps } from "./Button";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { RiWallet3Line } from "react-icons/ri";
import truncateHash from "utils/truncateHash";
import useWallet from "hooks/useWallet";

const ConnectWalletButton = ({action}: ButtonProps & { action?: (...args: any[]) => void }) => {
  const {
    aspWallet: { active, error, retry },
  } = useAppContext();
  const { account } = useActiveWeb3React();
  const { onPresentConnectModal } = useWallet();

  const openModal = () => {
    if(action) action();
    onPresentConnectModal();
  };

  return (
    <>
      {active && account && (
        <button
          aria-label="Open connect modal"
          onClick={openModal}
          className="block w-full lg:inline-block text-sm bg-primary-700/60 py-1 px-2 lg:rounded-full
            cursor-pointer hover:bg-primary-700/40 transition-colors duration-300"
        >
          <RiWallet3Line className="h-9 w-9 inline-block text-white mx-2" />
          {truncateHash(account)}
        </button>
      )}
      {!active && !error && (
        <Button onClick={openModal} variant="outlined" className="py-2 text-primary px-3.5 w-full
          lg:text-sm lg:w-auto">
          Connect wallet
        </Button>
      )}
      {!active && error && (
        <Button
          variant="outlined"
          className="ring-white bg-primary-50 w-full lg:w-auto text-primary !px-3.5 !py-2 text-sm"
          onClick={() => {
            if(action) action();
            retry();
          }}
        >
          Retry connecting
        </Button>
      )}
    </>
  );
};

export default ConnectWalletButton;

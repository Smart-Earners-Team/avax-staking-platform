import { BigNumber } from "bignumber.js";
import Button from "components/Button/Button";
import ModalActions from "components/widgets/Modal/ModalActions";
import { ASP_DECIMALS } from "config/constants";
import { parseUnits } from "ethers/lib/utils";
import useToast from "hooks/useToast";
import React, { useCallback, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { formatBigNumber } from "utils/formatBalance";

interface ModalProps {
  tokenBalance: BigNumber;
  referrer: string;
  tokenName: string;
  onConfirm: (amount: string, ref: string) => Promise<void>;
  onDismiss?: () => void;
}

export const EnterAuctionModal = ({
  tokenBalance,
  referrer,
  tokenName,
  onConfirm,
  onDismiss,
}: ModalProps) => {
  const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);
  const [amount, setAmount] = useState("");
  const [ref, setRef] = useState(referrer);

  const amountToStake = new BigNumber(amount);
  const isBalanceZero = tokenBalance.isFinite() && tokenBalance.isEqualTo(0);

  const handleChange: React.FormEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const input = e.currentTarget.name;
      const val = e.currentTarget.value;

      if (input === "amount") {
        const pattern = /^[0-9]*[.,]?[0-9]{0,8}$/g;
        if (!pattern.test(val)) return;
        setAmount(val);
      } else if (input === "ref") {
        setRef(val);
      }
    },
    [setAmount, setRef]
  );

  const handleSelectMax = useCallback(() => {
    setAmount(tokenBalance.toJSON());
  }, [tokenBalance]);

  const displayBalance = (balance: BigNumber) => {
    if (isBalanceZero) {
      return "0";
    }
    const balanceUnits = parseUnits(balance.toJSON(), 8);
    return formatBigNumber(balanceUnits, ASP_DECIMALS, ASP_DECIMALS);
  };

  return (
    <div
      className="w-[90%] p-4 outline-none max-w-xs mx-auto rounded-md absolute left-1/2 -translate-x-1/2
      top-1/2 -translate-y-1/2 bg-white font-sans transition duration-300 shadow-md"
    >
      <div className="relative text-xl font-medium mt-2 mb-4 p-4">
        <div className="text-left text-lg">Enter Auction Lobby</div>
        <span
          onClick={onDismiss}
          className="absolute hover:bg-gray-100 top-0 right-0 p-1 inline-block rounded-full cursor-pointer"
        >
          <RiCloseLine className="h-8 w-8" />
        </span>
      </div>
      <div className="mb-1 text-sm text-right">
        Balance: {displayBalance(tokenBalance)}{" "}
        <span className="text-primary-700 font-semibold text-xl">
          {tokenName}
        </span>
        {isBalanceZero && (
          <p className="text-xs text-red-400">There are no tokens to stake.</p>
        )}
      </div>
      <div className="mb-6">
        <div className="relative block my-2">
          <label htmlFor="amount" className="text-sm mb-2 block">
            Enter amount
          </label>
          <Button
            onClick={handleSelectMax}
            type="button"
            variant="outlined"
            className="!p-1 absolute shadow-md top-1/2 right-4 text-sm ring-transparent bg-gray-100
              text-gray-600"
          >
            Max
          </Button>
          <input
            autoComplete="off"
            onChange={handleChange}
            type="text"
            name="amount"
            id="amount"
            value={amount}
            className="border-none rounded-sm transition-colors duration-300 border-gray-300
            focus:ring-gray-400 pt-3 pb-1 w-full outline-none ring-2 ring-gray-300 px-2"
          />
        </div>
        <div className="relative block my-2">
          <label htmlFor="ref" className="text-sm mb-2 block">
            Referrer address
          </label>
          <input
            autoComplete="off"
            onChange={handleChange}
            type="text"
            name="ref"
            id="ref"
            value={ref}
            className="border-none rounded-sm transition-colors duration-300 border-gray-300
            focus:ring-gray-400 pt-3 pb-1 w-full outline-none ring-2 ring-gray-300 px-2
                text-sm"
          />
        </div>
      </div>
      <ModalActions>
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white mx-0"
          variant="secondary"
          onClick={onDismiss}
          disabled={pendingTx}
        >
          Cancel
        </Button>
        <Button
          className="w-full mx-0"
          disabled={
            pendingTx ||
            !amountToStake.isFinite() ||
            amountToStake.eq(0) ||
            amountToStake.gt(tokenBalance)
          }
          onClick={async () => {
            setPendingTx(true);
            try {
              await onConfirm(amount, ref);
              toastSuccess("Success!", "Your have joined the auction lobby.");
              onDismiss && onDismiss();
            } catch (e) {
              console.error(e);
              toastError(
                "Error",
                "Please try again. Confirm the transaction and make sure you are paying enough gas!"
              );
            } finally {
              setPendingTx(false);
            }
          }}
        >
          {pendingTx ? "Confirming" : "Confirm"}
        </Button>
      </ModalActions>
    </div>
  );
};

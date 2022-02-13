import { BigNumber } from "bignumber.js";
import Button from "components/Button/Button";
import ModalActions from "components/widgets/Modal/ModalActions";
import ModalInput from "components/widgets/Modal/ModalInput";
import { ASP_DECIMALS } from "config/constants";
import { parseUnits } from "ethers/lib/utils";
import useToast from "hooks/useToast";
import React, { useCallback, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { formatBigNumber } from "utils/formatBalance";

interface DepositModalProps {
  aspBalance: BigNumber;
  tokenName: string;
  onConfirm: (amount: string, days: string) => Promise<void>;
  onDismiss?: () => void;
}

export const DepositModal = ({
  aspBalance,
  tokenName,
  onConfirm,
  onDismiss,
}: DepositModalProps) => {
  const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [daysToStake, setDaysToStake] = useState("");
  const startDay = 1;

  const amountToStake = new BigNumber(stakeAmount);
  const isBalanceZero = aspBalance.isFinite() && aspBalance.isEqualTo(0);

  const handleChange: React.FormEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      const input = e.currentTarget.name;
      const val = e.currentTarget.value.replace(/,/g, ".");
      const pattern = /^[0-9]*[.,]?[0-9]{0,8}$/g;
      if (!pattern.test(val)) return;
      if (input === "amount") {
        setStakeAmount(val);
      } else if (input === "days") {
        setDaysToStake(val);
      }
    },
    [setStakeAmount, setDaysToStake]
  );

  const handleSelectMax = useCallback(() => {
    setStakeAmount(aspBalance.toJSON());
  }, [aspBalance]);

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
      title="Stake LP tokens"
    >
      <div className="relative text-xl font-medium mt-2 mb-4 p-4">
        <div className="text-left text-lg">Stake {tokenName}</div>
        <span
          onClick={onDismiss}
          className="absolute hover:bg-gray-100 top-0 right-0 p-1 inline-block rounded-full cursor-pointer"
        >
          <RiCloseLine className="h-8 w-8" />
        </span>
      </div>
      <div className="mb-1 text-sm text-right">
        Balance: {displayBalance(aspBalance)}{" "}
        <span className="text-primary-700 font-semibold text-xl">ASP</span>
        {isBalanceZero && (
          <p className="text-xs text-red-400">There are no tokens to stake.</p>
        )}
      </div>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        stakeAmount={stakeAmount}
        daysToStake={daysToStake}
      />
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
            amountToStake.gt(aspBalance)
          }
          onClick={async () => {
            setPendingTx(true);
            try {
              await onConfirm(stakeAmount, daysToStake);
              toastSuccess(
                "Staked!",
                "Your funds have been staked in the pool."
              );
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
      <div className="text-center text-sm flex justify-center mt-8">
        <div className="inline-block mx-2">
          Start day <br />
          {startDay}
        </div>
        <div className="inline-block mx-2">
          Last full day <br />
          {daysToStake === "" ? "-" : daysToStake}
        </div>
        <div className="inline-block mx-2">
          End day <br />
          {daysToStake === "" ? "-" : Number(daysToStake) + 1}
        </div>
      </div>
    </div>
  );
};

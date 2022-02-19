import React, { useCallback, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { getFullDisplayBalance } from "utils/formatBalance";
import useToast from "hooks/useToast";
import { RiCloseLine } from "react-icons/ri";
import Button from "components/Button/Button";
import ModalInput from "components/widgets/Modal/ModalInput";
import ModalActions from "components/widgets/Modal/ModalActions";

interface WithdrawModalProps {
  max: BigNumber;
  days: string;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  max,
  days,
  tokenName = "",
}) => {
  const [val, setVal] = useState("");
  const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, undefined, 5);
  }, [max]);

  const valNumber = new BigNumber(val);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, "."));
      }
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(getFullDisplayBalance(max, undefined, 18));
  }, [max, setVal]);

  return (
    <div className="w-[90%] p-4 outline-none max-w-xs mx-auto absolute left-1/2 -translate-x-1/2 top-1/2
      -translate-y-1/2 bg-gray-900 rounded-xl ring ring-primary-50/40 font-sans transition duration-300">
      <div className="relative text-xl font-medium text-center mt-2 mb-4 p-4">
        <div className="text-left">Withdraw {tokenName}</div>
        <span
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 bg-primary-50/40 inline-block rounded-full hover:bg-primary-50/70 cursor-pointer"
        >
          <RiCloseLine className="h-8 w-8" />
        </span>
      </div>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        stakeAmount={val}
        daysToStake={days}
      />
      <ModalActions>
        <Button
          className="w-full bg-red-600 text-white"
          variant="secondary"
          onClick={onDismiss}
          disabled={pendingTx}
        >
          Cancel
        </Button>
        <Button
          disabled={
            pendingTx ||
            !valNumber.isFinite() ||
            valNumber.eq(0) ||
            valNumber.gt(fullBalanceNumber)
          }
          className="w-full"
          onClick={async () => {
            setPendingTx(true);
            try {
              await onConfirm(val);
              toastSuccess(
                "Unstaked!",
                "Your earnings have also been harvested to your wallet"
              );
              onDismiss && onDismiss();
            } catch (e) {
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

export default WithdrawModal;

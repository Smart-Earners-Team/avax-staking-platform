import React from "react";
import BigNumber from "bignumber.js";
import useModal from "components/widgets/Modal/useModal";
import Button from "components/Button/Button";
import { DepositModal } from "components/Modals/DepositeModal";
import { useAppContext } from "hooks/useAppContext";
import useStakePools from "hooks/useStakePools";
import { fetchPoolsUserDataAsync } from "state/pools";
import { useAppDispatch } from "state";
import { fetchPoolUserStakeCount } from "state/pools/fetchPoolUser";
import useActiveWeb3React from "hooks/useActiveWeb3React";

const StakeAction = () => {
  // TODO: change
  /* 
  const { onUnstake } = useUnstakeFarms(pid); */
  const { onStake } = useStakePools();
  const {
    aspWallet: { balance },
  } = useAppContext();
  const dispatch = useAppDispatch();
  const { account, library } = useActiveWeb3React();

  const handleStake = async (amount: string, days: string) => {
    // in serialized form
    if (account && library) {
      await onStake(amount, days);
      const indexs = await fetchPoolUserStakeCount(account, library.getSigner());
      const stakeIndexs = new Array(indexs).fill(0).map((e, i) => i);
      dispatch(fetchPoolsUserDataAsync({ account, signer: library.getSigner(), stakeIndexs }));
    }
  };
  /* 
  const handleUnstake = async (amount: string) => {
    await onUnstake(amount);
    if (account && library && pid)
      dispatch(
        fetchPoolsUserDataAsync({
          account,
          signer: library.getSigner(),
          stakeIndexs: [pid],
        })
      );
  }; */

  const [onPresentDeposit] = useModal(
    <DepositModal
      aspBalance={new BigNumber(balance)}
      onConfirm={handleStake}
      tokenName="ASP"
    />
  );

  const renderStakingButtons = () => {
    return (
      <Button
        variant="secondary"
        className="py-2 px-5 w-full block my-8 max-w-xs mx-auto"
        onClick={onPresentDeposit}
      >
        Stake ASP
      </Button>
    );
  };

  return (
    <div className="justify-center items-center">
      <div className="flex flex-col items-start">{renderStakingButtons()}</div>
    </div>
  );
};

export default StakeAction;

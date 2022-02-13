import React from "react";
import Button from "components/Button/Button";

interface ModalInputProps {
  onSelectMax?: () => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  stakeAmount: string;
  daysToStake: string;
}

const ModalInput = ({
  onChange,
  onSelectMax,
  stakeAmount,
  daysToStake,
}: ModalInputProps) => {
  return (
      <div className="mb-6">
        <div className="relative block my-2">
          <label htmlFor="amount" className="text-sm mb-2 block">
            Amount to Stake
          </label>
          <Button
            onClick={onSelectMax}
            type="button"
            variant="outlined"
            className="!p-1 absolute shadow-md top-1/2 right-4 text-sm ring-transparent bg-gray-100
              text-gray-600"
          >
            Max
          </Button>
          <input
            autoComplete="off"
            onChange={onChange}
            type="text"
            name="amount"
            id="amount"
            value={stakeAmount}
            className="border-none rounded-sm transition-colors duration-300 border-gray-300
            focus:ring-gray-400 pt-3 pb-1 w-full outline-none ring-2 ring-gray-300 px-2"
          />
        </div>
        <div className="relative block my-2">
          <label htmlFor="days" className="text-sm mb-2 block">
            Days to Stake
          </label>
          <input
            autoComplete="off"
            onChange={onChange}
            type="text"
            name="days"
            id="days"
            value={daysToStake}
            className="border-none rounded-sm transition-colors duration-300 border-gray-300
            focus:ring-gray-400 pt-3 pb-1 w-full outline-none ring-2 ring-gray-300 px-2"
          />
        </div>
      </div>
  );
};

export default ModalInput;

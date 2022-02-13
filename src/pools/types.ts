export interface StakePoolSerialized {
  startDay: SerializedBigNumber;
  endDay: SerializedBigNumber;
  progress: number;
  stakedAmount: SerializedBigNumber;
  shares: SerializedBigNumber;
  dividends: SerializedBigNumber;
  bonus: SerializedBigNumber;
  paidAmount: SerializedBigNumber;
  daysToStake: SerializedBigNumber;
}

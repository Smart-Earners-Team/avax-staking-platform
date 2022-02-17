import Countdown from "react-countdown";

const getNextDay = () => {
  const tomorrow = new Date("Sun, 20 Feb 2022 GMT");
  // set to midnight
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toUTCString();
};

export default function CountdownTimer() {
  return (
    <div className="inline-block">
      <Countdown date={getNextDay()} />
    </div>
  );
}

import Countdown from "react-countdown";

const getNextDay = () => {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  // set to midnight
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toUTCString();
};

export default function CountdownTimer() {
  return (
    <div className="inline-block">
      <Countdown
        autoStart
        daysInHours
        date={getNextDay()}
        ref={(arg) => {
          if (arg) {
            const { isCompleted, start } = arg.getApi();
            if (isCompleted()) start();
          }
        }}
      />
    </div>
  );
}

import React from "react";
import Navbar from "./Navbar";
import PrimaryFooter from "./PrimaryFooter";
import CountdownTimer from "./widgets/Utils/CountdownTimer";

export default function Layout(props: React.HTMLAttributes<"div">) {
  return (
    <div>
      <div className="text-center flex justify-center flex-wrap items-center py-2 bg-primary-700
        text-white font-medium text-sm">
        <div>
          Auction Starts: <CountdownTimer />
        </div>
      </div>
      <Navbar />
      <div className={`min-h-screen ${props.className}`}>{props.children}</div>
      <PrimaryFooter />
    </div>
  );
}

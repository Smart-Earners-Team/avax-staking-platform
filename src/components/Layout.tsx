import React from "react";
import Navbar from "./Navbar";
import PrimaryFooter from "./PrimaryFooter";

export default function Layout(props: React.HTMLAttributes<"div">) {
  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${props.className}`}>{props.children}</div>
      <PrimaryFooter />
    </>
  );
}

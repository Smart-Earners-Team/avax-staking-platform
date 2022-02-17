import React, { useState } from "react";
import Link from "./Link";
import ConnectWalletButton from "./Button/ConnectWalletButton";
import { links, siteName } from "globalData";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setOpen((p) => !p);
  };

  const closeMenu: React.MouseEventHandler<HTMLAnchorElement> | undefined = (
    e
  ) => {
    e?.stopPropagation();
    setOpen(true);
  };

  return (
    <div className="w-full text-white bg-primary-500 py-5">
      <div className="flex flex-col max-w-screen-xl px-4 mx-auto lg:items-center lg:justify-between
        lg:flex-row md:px-6">
        <div className="flex flex-row items-center justify-between">
          <Link
            to="/"
            className="text-lg font-semibold tracking-widest uppercase
                rounded-lg focus:outline-none focus:shadow-outline"
          >
            {siteName}
          </Link>
          <button
            className="rounded-lg lg:hidden p-1 hover:bg-gray-200 focus:outline-none
              focus:bg-gray-100 hover:text-primary focus:text-primary"
            onClick={toggleMenu}
          >
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-8 h-8">
              {/* bars */}
              <path
                className={open ? "hidden" : "inline-block"}
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
              {/* cancel */}
              <path
                className={open ? "inline-block" : "hidden" }
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <nav
          className={`${
            open ? "block" : "hidden"
          } lg:block`}
        >
          <ul className="flex flex-col flex-grow pb-4 lg:pb-0 lg:flex-row lg:justify-end lg:items-center">
            {links.map(({ name, ...rest }, i) => (
              <li key={name} className="inline-block mt-2 lg:mt-0 lg:ml-3">
                <Link
                  className="px-5 block py-3 lg:text-sm font-semibold bg-transparent rounded-lg
                hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200
                focus:bg-gray-200 focus:outline-none focus:shadow-outline transition-colors duration-300"
                  {...rest}
                >
                  {name}
                </Link>
              </li>
            ))}
            <li className="inline-block mt-2 lg:mt-0 lg:ml-3">
              <ConnectWalletButton action={closeMenu} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

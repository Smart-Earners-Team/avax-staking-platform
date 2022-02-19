import React, { useMemo, useState } from "react";
import "react-step-progress-bar/styles.css";
import { useTable } from "react-table";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import useEnterAuction from "hooks/useEnterAuction";
import useModal from "components/widgets/Modal/useModal";
import { useAppContext } from "hooks/useAppContext";
import BigNumber from "bignumber.js";
import { EnterAuctionModal } from "components/Modals/EnterAuctionModal";
import { useAuctions } from "state/auctions/hooks";
import clx from "classnames";
import { fetchAuctionUserDataAsync } from "state/auctions";
import spreadToArray from "utils/spreadNumberToArray";
import useExitAuction from "hooks/useExitAuction";
import { fetchDayAuctionCount } from "state/auctions/fetchAuctionUser";

type Accessor =
  | "day"
  | "pool"
  | "state"
  | "aspAvax"
  | "recieve"
  | "entry"
  | "action";

export default function AuctionTable() {
  const { data: auctions } = useAuctions();
  const dispatch = useAppDispatch();
  const { account, library } = useActiveWeb3React();
  const {
    aspWallet: { bnbBalance },
    refAddress,
    currentDay,
  } = useAppContext();
  const { onEnter } = useEnterAuction();
  const { onExit } = useExitAuction();
  // endstake transcation call
  const [pendingTx, setPendingTx] = useState<{ [key: string]: boolean }>();

  const transactionEnded = (key: string) => {
    console.log(key);
    if (!pendingTx) return;
    const pending = pendingTx[key] === true;
    if (pending) {
      console.log({ ...pendingTx, key: false });
      setPendingTx((p) => ({ ...p, key: false }));
    }
  };

  const tableRowsData = useMemo(
    () =>
      auctions.map((a) => ({
        day: a.id + 1,
        pool: a.pool,
        state: a.ended ? "CLOSED" : "OPEN",
        aspAvax: a.aspPerAvax, // user data
        recieve: a.userData.rewards.toJSON(), // user data
        entry: a.userData.entryAmount.toJSON(), // userdata
        action: a.action, // enter or exit
      })),
    [auctions]
  );

  const columns: {
    Header: Omit<React.ReactNode, "null">;
    accessor: Accessor;
  }[] = useMemo(
    () => [
      {
        Header: "Day",
        accessor: "day",
      },
      {
        Header: "ASP POOL",
        accessor: "pool",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "ASP/AVAX",
        accessor: "aspAvax",
      },
      {
        Header: "ASP received ",
        accessor: "recieve",
      },
      {
        Header: "Your Entry",
        accessor: "entry",
      },
      {
        Header: "Status",
        accessor: "action",
      },
    ],
    []
  );

  const tableInstance = useTable({
    columns,
    data: tableRowsData,
  });
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    tableInstance;

  const actionAndRefreshHandler = async (func: () => Promise<void>) => {
    if (account && library) {
      await func();
      if (!currentDay) return;
      // get current day from app context
      const indexes = spreadToArray(currentDay.value);
      // fetch auctions
      dispatch(
        fetchAuctionUserDataAsync({
          account,
          ids: indexes,
          signer: library.getSigner(),
        })
      );
    }
  };

  const handleEnterAuction = async (amount: string, referrer: string) => {
    try {
      await actionAndRefreshHandler(() => onEnter(amount, referrer));
    } catch (error) {
      throw error;
    }
  };

  const exitLobby = async (enterDay: number, count: number) => {
    try {
      await actionAndRefreshHandler(() => onExit(enterDay, count));
    } catch (error) {
      throw error;
    }
  };

  const [onPresentDeposit] = useModal(
    <EnterAuctionModal
      tokenBalance={new BigNumber(bnbBalance)}
      referrer={refAddress}
      onConfirm={handleEnterAuction}
      tokenName="BNB"
    />
  );

  return (
    <div>
      <div className="w-full overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200 table-auto"
          {...getTableProps()}
        >
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    scope="col"
                    {...column.getHeaderProps()}
                    className="py-3 px-2 text-xs min-w-min whitespace-nowrap font-medium tracking-wider
                        text-left text-gray-700 uppercase"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-gray-200 w-full"
          >
            {rows.length > 0 &&
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => {
                      const isAction = cell.column.id === "action";
                      if (isAction) {
                        const action =
                          cell.value as typeof tableRowsData[0]["action"];
                        const ended = action === "ended";
                        const toExit = action === "exit";
                        const toEnter = action === "enter";

                        const enterClassName = `bg-green-400 hover:bg-green-500 focus:bg-green-500
                          focus:ring-green-500 focus-within:ring-green-500`;
                        const exitClassName = `bg-red-400 hover:bg-red-500 focus:bg-red-500 focus:ring-red-500
                          focus-within:ring-red-500`;
                        const endClassName = "bg-gray-300 cursor-not-allowed";
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="p-4 text-sm text-gray-900 whitespace-nowrap"
                          >
                            {
                              <button
                                onClick={async () => {
                                  if (
                                    account &&
                                    typeof currentDay !== "undefined"
                                  ) {
                                    setPendingTx((p) => ({
                                      ...p,
                                      [cell.row.id]: true,
                                    }));
                                    try {
                                      const count = await fetchDayAuctionCount(
                                        account,
                                        currentDay.index.toString()
                                      );
                                      if (toEnter) onPresentDeposit();
                                      if (toExit) exitLobby(currentDay.index, count);
                                    } catch (error) {
                                      console.log(error);
                                    } finally {
                                      transactionEnded(cell.row.id);
                                    }
                                  }
                                }}
                                disabled={
                                  pendingTx && pendingTx[cell.row.id] === true
                                }
                                className={clx(
                                  `py-1 px-3 text-sm rounded-full shadow disabled:cursor-not-allowed
                                    disabled:opacity-70 ring-2 ring-offset-1 ring-transparent transition-all
                                    duration-100`,
                                  {
                                    [enterClassName]: toEnter,
                                    [exitClassName]: toExit,
                                    [endClassName]: ended,
                                  }
                                )}
                              >
                                {toEnter ? "Enter" : toExit ? "Exit" : "Ended"}
                              </button>
                            }
                          </td>
                        );
                      }

                      return (
                        <td
                          {...cell.getCellProps()}
                          className="p-4 text-sm text-gray-900 whitespace-nowrap"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            {rows.length <= 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-5 text-sm bg-gray-50 animate-pulse"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

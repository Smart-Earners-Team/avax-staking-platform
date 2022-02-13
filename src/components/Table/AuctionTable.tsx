import React, { useMemo, useState } from "react";
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { useTable, Cell } from "react-table";
import Button from "components/Button/Button";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAspContract } from "hooks/useContract";
import useToast from "hooks/useToast";
import { fetchPoolUserStakeCount } from "state/pools/fetchPoolUser";
import { fetchPoolsUserDataAsync } from "state/pools";
import { useAppDispatch } from "state";
import { usePools } from "state/pools/hooks";
import { fetchUserAuctionsData } from "state/auctions/fetchAuctionUser";

type Accessor = "day" | "pool" | "state" | "recieve" | "entry" | "action";

export default function AuctionTable() {
  const { userDataLoaded } = usePools();
  const dispatch = useAppDispatch();
  const { active, account, library } = useActiveWeb3React();
  const aspContract = useAspContract();
  const { toastSuccess, toastError } = useToast();
  // endstake transcation call
  const [pendingTx, setPendingTx] = useState<{ [key: string]: boolean }>();

  const transactionEnded = (key: string) => {
    if (!pendingTx) return;
    const pending = pendingTx[key] === true;
    if (pending) {
      console.log({ ...pendingTx, key: false });
      setPendingTx((p) => ({ ...p, key: false }));
    }
  };

  if(account && library) {
      fetchUserAuctionsData(account, [0], library.getSigner());
  }
  const tableRowsData = useMemo(
    () => [
      {
        day: "1",
        pool: "200",
        state: "OPEN",
        recieve: "24 ASP",
        entry: "2",
        action: () => {},
      },
    ],
    []
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
        Header: "Pool",
        accessor: "pool",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "You'll Recieve",
        accessor: "recieve",
      },
      {
        Header: "Your Entry",
        accessor: "entry",
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    []
  );

  const tableInstance = useTable({
    columns,
    data: tableRowsData,
  });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = tableInstance;

  const handleStakeEnd = async (cell: Cell<typeof tableRowsData[0], any>) => {
    setPendingTx((p) => ({
      ...p,
      [cell.row.id]: true,
    }));
    try {
      await cell.value(aspContract);
      if (account && library) {
        const indexs = await fetchPoolUserStakeCount(
          account,
          library.getSigner()
        );
        const stakeIndexs = new Array(indexs).fill(0).map((e, i) => i);
        dispatch(
          fetchPoolsUserDataAsync({
            account,
            signer: library.getSigner(),
            stakeIndexs,
          })
        );
      }
      toastSuccess("Success!", "You have ended your stake in this pool.");
      transactionEnded(cell.row.id);
    } catch (error) {
      toastError(
        "Error",
        "Please try again. Confirm the transaction and make sure you are paying enough gas!"
      );
      transactionEnded(cell.row.id);
    }
  };

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
            {userDataLoaded &&
              rows.length > 0 &&
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => {
                      const isProgress = cell.column.id === "progress";
                      const isAction = cell.column.id === "action";
                      if (isProgress)
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="p-4 text-sm text-gray-900 whitespace-nowrap"
                          >
                            {
                              <ProgressBar
                                percent={Number(cell.value)}
                                height={5}
                                width={70}
                              />
                            }
                          </td>
                        );
                      if (isAction)
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="p-4 text-sm text-gray-900 whitespace-nowrap"
                          >
                            {
                              <Button
                                onClick={() => handleStakeEnd(cell)}
                                disabled={true
                                //   pendingTx && pendingTx[cell.row.id] === true
                                }
                                className="py-1 px-2"
                              >
                                Enter
                              </Button>
                            }
                          </td>
                        );
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
            {userDataLoaded && rows.length <= 0 && (
              <tr>
                <td colSpan={9} className="text-center py-5 text-sm bg-gray-50">
                  No records to show. Stake some ASP
                </td>
              </tr>
            )}
            {!userDataLoaded && (
              <tr>
                {active ? (
                  <td
                    colSpan={9}
                    className="text-center py-4 text-sm bg-gray-50 animate-pulse"
                  >
                    Loading...
                  </td>
                ) : (
                  <td colSpan={9} className="text-center py-4 text-sm">
                    Connect your wallet to load records
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

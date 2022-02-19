import React, { useMemo, useState } from "react";
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { useTable, usePagination, Cell } from "react-table";
import Button from "components/Button/Button";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAspContract } from "hooks/useContract";
import useToast from "hooks/useToast";
import { fetchPoolUserStakeCount } from "state/pools/fetchPoolUser";
import { fetchPoolsUserDataAsync } from "state/pools";
import { useAppDispatch } from "state";
import { usePools } from "state/pools/hooks";

type Accessor =
  | "start"
  | "end"
  | "progress"
  | "amountStaked"
  | "shares"
  | "dividends"
  | "bonus"
  | "paidAmount"
  | "action";

export default function StakingTable() {
  const { userDataLoaded, data } = usePools();
  const dispatch = useAppDispatch();
  const { active, account } = useActiveWeb3React();
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

  const tableRowsData = useMemo(
    () =>
      data.map((pool) => ({
        start: pool.startDay.toJSON(),
        end: pool.endDay.toJSON(),
        progress: pool.progress.toString(),
        amountStaked: pool.stakedAmount.toJSON(),
        shares: pool.shares.toJSON(),
        dividends: pool.dividends.toJSON(),
        bonus: pool.bonus.toJSON(),
        paidAmount: pool.paidAmount.toJSON(),
        action: pool.action,
      })),
    [data]
  );

  const columns: {
    Header: Omit<React.ReactNode, "null">;
    accessor: Accessor;
  }[] = useMemo(
    () => [
      {
        Header: "Start",
        accessor: "start",
      },
      {
        Header: "End",
        accessor: "end",
      },
      {
        Header: "Progress",
        accessor: "progress",
      },
      {
        Header: (
          <>
            Amount <br /> Staked
          </>
        ),
        accessor: "amountStaked",
      },
      {
        Header: "Shares",
        accessor: "shares",
      },
      {
        Header: "Dividends",
        accessor: "dividends",
      },
      {
        Header: (
          <>
            Bonus Day Rewads + <br /> Stake Interest
          </>
        ),
        accessor: "bonus",
      },
      {
        Header: "Paid Amount",
        accessor: "paidAmount",
      },
      {
        Header: "Action",
        accessor: "action",
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: tableRowsData,
      initialState: { pageIndex: 0 },
      autoResetPage: false,
    },
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const handleStakeEnd = async (cell: Cell<typeof tableRowsData[0], any>) => {
    setPendingTx((p) => ({
      ...p,
      [cell.row.id]: true,
    }));
    try {
      if (!aspContract) return;
      await cell.value(aspContract);
      if (account) {
        const indexs = await fetchPoolUserStakeCount(account);
        const stakeIndexs = new Array(indexs).fill(0).map((e, i) => i);
        dispatch(
          fetchPoolsUserDataAsync({
            account,
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
              page.length > 0 &&
              page.map((row) => {
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
                                disabled={
                                  pendingTx && pendingTx[cell.row.id] === true
                                }
                                className="py-1 px-2"
                              >
                                End stake
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
            {userDataLoaded && page.length <= 0 && (
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
      <div
        className="mt-3 flex flex-col md:flex-row-reverse md:flex-start md:gap-3 items-center
        bg-gray-100"
      >
        <div className="text-sm text-gray-500 mt-3 md:mt-0">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="w-20 border-b-2 outline-none border-gray-500 px-1 rounded-sm"
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="w-20 border-b-2 outline-none border-gray-500 rounded-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="my-4">
          <ul className="flex pl-0 list-none">
            <ListItem>
              <button
                className="py-1 px-2 text-sm rounded-md disabled:cursor-not-allowed
                  disabled:opacity-40"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                First
              </button>
            </ListItem>
            <ListItem>
              <button
                className="py-1 px-2 text-sm rounded-md disabled:cursor-not-allowed
                  disabled:opacity-40"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Previous
              </button>
            </ListItem>
            <ListItem>
              <button
                className="py-1 px-2 text-sm rounded-md disabled:cursor-not-allowed
                disabled:opacity-40"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </ListItem>
            <ListItem>
              <button
                className="py-1 px-2 text-sm rounded-md disabled:cursor-not-allowed
                disabled:opacity-40"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                Last
              </button>
            </ListItem>
          </ul>
        </div>
      </div>
    </div>
  );
}

const ListItem = (props: { children: React.ReactNode }) => (
  <li className="relative block leading-tight bg-white border border-gray-300 text-blue-700 ml-1">
    {props.children}
  </li>
);

import React, { useMemo } from "react";
import { ProgressBar } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { DeserializedPoolsState } from "state/types-pool";
import { useTable, usePagination } from "react-table";
import Button from "components/Button/Button";
import useActiveWeb3React from "hooks/useActiveWeb3React";

interface StakingTableProps {
  pools: DeserializedPoolsState;
}
export default function StakingTable({ pools }: StakingTableProps) {
  const { userDataLoaded, data } = pools;

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
      })),
    [data]
  );

  type Accessor =
    | "start"
    | "end"
    | "progress"
    | "amountStaked"
    | "shares"
    | "dividends"
    | "bonus"
    | "paidAmount";

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

  const { active } = useActiveWeb3React();

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
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => {
                      const isProgress = cell.column.id === "progress";
                      if (isProgress)
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap"
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
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            {!userDataLoaded && (
              <tr>
                {active ? (
                  <td
                    colSpan={8}
                    className="text-center py-4 text-sm bg-gray-50 animate-pulse"
                  >
                    Loading...
                  </td>
                ) : (
                  <td
                    colSpan={8}
                    className="text-center py-4 text-sm"
                  >
                    Connect your wallet to load records
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-col items-center">
        <div className="text-sm">
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
              className="w-20 border-b-2 outline-none border-gray-500"
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="w-20 border-b-2 outline-none border-gray-500"
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
              <Button
                variant="secondary"
                className="py-1 px-2 text-sm font-light"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                First
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="secondary"
                className="py-1 px-2 text-sm font-light"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Previous
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="secondary"
                className="py-1 px-2 text-sm font-light"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="secondary"
                className="py-1 px-2 text-sm font-light"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                Last
              </Button>
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

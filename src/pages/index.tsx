import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";
import {
  Timestamp,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { firebaseApp } from "@/lib/firebase";
import {
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { COLUMNS } from "@/lib/table";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { setup } from "@/lib/csrf";

export default function Home({ data }: any) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableColumns = useMemo(() => COLUMNS, []);
  const tableData = useMemo(() => data, []);

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);

      return () => clearTimeout(timeout);
    }, [value]);

    return (
      <input
        {...props}
        value={value}
        className="px-4 py-2"
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

  return (
    <>
      <NextHeadSeo
        title="SPBUploader"
        description="シンプルなSparebeatの譜面アップローダー"
      />
      <Layout className="px-4">
        <h2 className="text-3xl font-bold">譜面一覧</h2>
        <div className="flex flex-col md:flex-row gap-2 justify-between mt-4">
          <label>
            <select
              className="mr-2 duration rounded-md border py-1"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            件表示
          </label>
          <div>
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg shadow border border-block"
              placeholder="検索"
            />
          </div>
        </div>
        <div className="my-4 block overflow-x-scroll">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className="bg-white last:border-b border-gray-200"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      className={twMerge(
                        "font-medium py-2",
                        !header.isPlaceholder && "cursor-pointer select-none"
                      )}
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={() => header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " ▲",
                            desc: " ▼",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => {
                return (
                  <tr
                    className="bg-white border-b border-gray-200"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "song_name") {
                        return (
                          <td className="px-4 py-3" key={cell.id}>
                            <Link
                              className="text-blue-500 duration-200 hover:text-blue-700"
                              href={`/map/${data[i].id}`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Link>
                          </td>
                        );
                      } else if (
                        cell.column.id === "song_composer" &&
                        data[i].song.composerUrl
                      ) {
                        return (
                          <td className="px-4 py-3" key={cell.id}>
                            <a
                              className="text-blue-500 duration-200 hover:text-blue-700"
                              href={data[i].song.composerUrl}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </a>
                          </td>
                        );
                      } else if (cell.column.id === "map_creator") {
                        return (
                          <td className="px-4 py-3" key={cell.id}>
                            <Link
                              key={cell.id}
                              className="text-blue-500 duration-200 hover:text-blue-700"
                              href={`/user/${data[i].uid}`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Link>
                          </td>
                        );
                      }
                      return (
                        <td className="px-4 py-3" key={cell.id}>
                          {cell.getContext().renderValue() as ReactNode}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center text-lg gap-4">
          <div className="flex items-center">
            <button
              className="bg-white rounded-l-md py-1 px-2 duration-200 hover:bg-gray-200 disabled:hover:bg-white"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="bg-white py-1 px-3 duration-200 hover:bg-gray-200 disabled:hover:bg-white"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            {[...Array(table.getPageCount())].map((_, i) => (
              <button
                key={i + 1}
                className={twMerge(
                  "bg-white py-1 px-3 duration-200 hover:bg-gray-200",
                  table.getState().pagination.pageIndex === i &&
                    "bg-blue-600 text-white hover:bg-blue-600"
                )}
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="bg-white py-1 px-3 duration-200 hover:bg-gray-200 disabled:hover:bg-white"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="bg-white rounded-r-md py-1 px-2 duration-200 hover:bg-gray-200 disabled:hover:bg-white"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
          </div>
          <span className="flex items-center gap-1">
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
            ページに移動
          </span>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    const db = getFirestore(firebaseApp);
    let data = (
      await getDocs(query(collection(db, "maps"), orderBy("createdAt", "desc")))
    ).docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate().toString(),
    }));
    return {
      props: {
        data,
      },
    };
  }
);

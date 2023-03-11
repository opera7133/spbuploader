import Layout from "@/components/Layout";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  orderBy,
} from "firebase/firestore";
import {
  BsCheckCircleFill,
  BsCheckCircle,
  BsXCircleFill,
} from "react-icons/bs";
import { firebaseApp } from "@/lib/firebase";
import Link from "next/link";
import {
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
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
import { twMerge } from "tailwind-merge";

export default function Profile({ user }: any) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const data = user.maps;
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
    <Layout className="px-4">
      <NextHeadSeo
        title={`${user.name}のプロフィール - SPBUploader`}
        description="シンプルなSparebeatの譜面アップローダー"
      />
      <div>
        <header className="mb-12 flex flex-row items-start gap-5">
          <div className="relative w-32 md:w-44 aspect-square">
            <Image
              src={user.avatar || "/img/avatar.png"}
              alt="Avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="mt-2 md:mt-5">
            <h2 className="text-2xl md:text-4xl font-bold break-all">
              {user.name}
            </h2>
            <div className="flex flex-row items-center gap-2 py-1">
              {user.verified ? (
                <div className="bg-white px-3 rounded-full py-0.5 flex items-center gap-1">
                  <BsCheckCircleFill color="#30b01c" size={20} />
                  <span className="mb-0.5 ">メール認証済み</span>
                </div>
              ) : (
                <div className="bg-white px-3 rounded-full py-0.5 flex items-center gap-1">
                  <BsCheckCircle color="gray" size={20} />
                  <span className="mb-0.5">メール認証待ち</span>
                </div>
              )}
              {user.disabled && (
                <div className="bg-white px-3 rounded-full py-0.5 flex items-center gap-1">
                  <BsXCircleFill color="#cc2823" size={20} />
                  <span className="mb-0.5 ">凍結中</span>
                </div>
              )}
            </div>
          </div>
        </header>
        <h2 className="text-xl font-bold">制作譜面一覧</h2>
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
        {table.getRowModel().rows.length > 0 ? (
          <>
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
                            !header.isPlaceholder &&
                              "cursor-pointer select-none"
                          )}
                          key={header.id}
                          colSpan={header.colSpan}
                          onClick={() =>
                            header.column.getToggleSortingHandler()
                          }
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
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
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
                ページに移動
              </span>
            </div>
          </>
        ) : (
          <p className="my-4 bg-white py-4 px-2 text-center">
            まだこのユーザーは譜面を作成していません！
          </p>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (!ctx.query.uid) {
    return {
      notFound: true,
    };
  }
  const user = await firebaseAdmin.auth().getUser(ctx.query.uid.toString());
  if (!user) {
    return {
      notFound: true,
    };
  }
  const db = getFirestore(firebaseApp);
  const mapsRef = collection(db, "maps");
  const q = query(
    mapsRef,
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );
  const data = (await getDocs(q)).docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt.toString(),
  }));
  return {
    props: {
      user: {
        uid: user.uid,
        avatar: user.photoURL || "",
        email: user.email,
        verified: user.emailVerified,
        disabled: user.disabled,
        name: user.displayName || user.email,
        maps: data,
      },
    },
  };
}

import Link from "next/link";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="z-50 container max-w-5xl mx-auto py-4 flex flex-row items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">
          <Link href="/">SPBUploader</Link>
        </h1>
      </div>
      <nav>
        <ul className="list-none flex flex-row gap-4 items-center">
          <li>
            <Link href="/">譜面一覧</Link>
          </li>
          <li>
            <Link href="/search">
              <BiSearch size={25} />
            </Link>
          </li>
          {session ? (
            <>
              <li className="flex">
                <Menu as="div" className="relative flex text-left">
                  <Menu.Button>
                    <Image
                      src={session.user?.picture || "/img/avatar.png"}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </Menu.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Menu.Items className="absolute top-8 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/user/${session.user?.uid}`}
                              className={twMerge(
                                "duration-200 group flex w-full items-center rounded-md px-2 py-2 text-sm",
                                active && "bg-fuchsia-600 text-white"
                              )}
                            >
                              プロフィール
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href={`/user/settings`}
                              className={twMerge(
                                "duration-200 group flex w-full items-center rounded-md px-2 py-2 text-sm",
                                active && "bg-fuchsia-600 text-white"
                              )}
                            >
                              ユーザー設定
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={twMerge(
                                "duration-200 group flex w-full items-center rounded-md px-2 py-2 text-sm",
                                active && "bg-fuchsia-600 text-white"
                              )}
                            >
                              ログアウト
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
              <li>
                <Link
                  href="/add"
                  className="bg-fuchsia-600 text-sm text-white px-4 py-2 rounded-lg font-medium duration-200 hover:bg-fuchsia-500"
                >
                  アップロード
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/user/signin"
                className="bg-fuchsia-600 text-sm text-white px-4 py-2 rounded-lg font-medium duration-200 hover:bg-fuchsia-500"
              >
                ログイン
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

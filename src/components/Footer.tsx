import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 text-sm container max-w-5xl mx-auto py-3 flex flex-col gap-3 md:flex-row items-start md:items-center justify-between">
      <p>
        Made by{" "}
        <a
          href="https://wmsci.com"
          className="text-blue-500 duration-200 hover:text-blue-700"
        >
          wamo
        </a>{" "}
        / Powered by{" "}
        <a
          href="https://sparebeat.com/"
          className="text-blue-500 duration-200 hover:text-blue-700"
        >
          Sparebeat
        </a>
      </p>
      <nav>
        <ul className="list-none flex flex-col md:flex-row items-start md:items-center gap-4">
          <li>
            <Link className="hover:underline" href="/about">
              このサイトについて
            </Link>
          </li>
          <li>
            <Link className="hover:underline" href="/privacy">
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <a
              className="hover:underline"
              href="https://github.com/opera7133/spbuploader"
            >
              ソースコード
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

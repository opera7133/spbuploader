import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-sm container max-w-5xl mx-auto py-3 flex flex-row items-center justify-between">
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
        <ul className="list-none flex flex-row items-center gap-4">
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

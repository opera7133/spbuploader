import { ReactNode } from "react";
import { Noto_Sans_JP } from "next/font/google";
import Head from "next/head";
import { twMerge } from "tailwind-merge";
import { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function Layout({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>
        {`
          :root {
            --notojp-font: ${notoSansJP.style.fontFamily};
          }
        `}
      </style>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="512x512" />
      </Head>
      <Header />
      <main className={twMerge("bg-gray-100 py-8 h-auto flex-1", className)}>
        <div className="container max-w-5xl mx-auto">{children}</div>
      </main>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Footer />
    </div>
  );
}

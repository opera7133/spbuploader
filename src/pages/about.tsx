import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";

export default function About() {
  return (
    <Layout className="px-4">
      <NextHeadSeo
        title="Q&A - SPBUploader"
        description="シンプルなSparebeatの譜面アップローダー"
        og={{
          title: "Q&A - SPBUploader",
          description: "シンプルなSparebeatの譜面アップローダー",
          image: `${process.env.NEXT_PUBLIC_NEXT_SITE_URL}/img/ogp.png`,
        }}
      />
      <h2 className="text-3xl font-bold my-4">Q&A</h2>
      <h3 className="text-2xl font-bold my-4">SPBUploaderとは？</h3>
      <p>
        SPBUploaderは、Sparebeatの譜面を自由にアップロードして遊ぶことのできるアップローダーです。
      </p>
      <h3 className="text-2xl font-bold my-4">
        <a
          href="https://sparebeat.com"
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-500 duration-200 hover:text-blue-700"
        >
          Sparebeat
        </a>
        とは？
      </h3>
      <p>
        <a
          href="https://suzukibakery.com/"
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-500 duration-200 hover:text-blue-700"
        >
          suzukibakery
        </a>
        氏の開発したウェブブラウザ上で動作する音楽ゲームシミュレーターです。
      </p>
      <h3 className="text-2xl font-bold my-4">譜面を作るには？</h3>
      <p>以下のサイトやツールが参考になります。</p>
      <ul className="list-disc ml-8 my-2">
        <li>
          <a
            href="https://yomogimochi45.xxxxxxxx.jp/htm0.html"
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-500 duration-200 hover:text-blue-700"
          >
            よもぎもちの物置
          </a>
        </li>
        <li>
          <a
            href="https://spbe.wmsci.com/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-500 duration-200 hover:text-blue-700"
          >
            Sparebeat Map Editor（not本家）
          </a>
        </li>
      </ul>
      <h3 className="text-2xl font-bold my-4">開発に参加するには？</h3>
      <p>
        何か提案やコードの改修案などあれば、
        <a
          href="https://github.com/opera7133/spbuploader"
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-500 duration-200 hover:text-blue-700"
        >
          GitHubのリポジトリ
        </a>
        にIssueやPull Requestを立てていただけるとありがたいです。
      </p>
    </Layout>
  );
}

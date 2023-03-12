import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";

export default function Privacy() {
  return (
    <Layout>
      <NextHeadSeo
        title="プライバシーポリシー - SPBUploader"
        description="シンプルなSparebeatの譜面アップローダー"
        og={{
          title: "プライバシーポリシー - SPBUploader",
          description: "シンプルなSparebeatの譜面アップローダー",
          image: `${process.env.NEXT_PUBLIC_NEXT_SITE_URL}/img/ogp.png`,
        }}
        twitter={{
          card: "summary",
          site: process.env.NEXT_PUBLIC_TWITTER_USER || "@scgame_m",
        }}
      />
      <h2 className="text-3xl font-bold my-4">プライバシーポリシー</h2>
      <p>
        SPBUploader（以下、「当サイト」といいます。）は、本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
      </p>
      <h3 className="text-2xl font-bold my-4">個人情報の利用目的</h3>
      <p>当サイトが個人情報を収集・利用する目的は、以下のとおりです。</p>
      <ul className="list-disc ml-8 my-2">
        <li>本サービスの提供・運営のため</li>
        <li>
          ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
        </li>
        <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
        <li>
          利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
        </li>
        <li>
          ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
        </li>
        <li>上記の利用目的に付随する目的</li>
      </ul>
      <h3 className="text-2xl font-bold my-4">個人情報の訂正および削除</h3>
      <p className="my-1">
        ユーザーは、当サイトの保有する自己の個人情報が誤った情報である場合には、当サイトが定める手続きにより、当サイトに対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。
        当サイトは、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
      </p>
      <p className="my-1">
        当サイトは、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。
      </p>
      <h3 className="text-2xl font-bold my-4">個人情報の利用停止等</h3>
      <p className="my-1">
        当サイトは、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
      </p>
      <p className="my-1">
        前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。
        当サイトは、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。
      </p>
      <p className="my-1">
        前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。
      </p>
      <h3 className="text-2xl font-bold my-4">Cookie</h3>
      <p>
        当サイトは、ユーザー認証にCookieを利用します。Cookieには個人を特定できる情報は含まれていません。
      </p>
      <h3 className="text-2xl font-bold my-4">Google Analytics</h3>
      <p className="my-1">
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
      </p>
      <p className="my-1">
        この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しての詳細は
        <a
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-500 duration-200 hover:text-blue-700"
          href="https://marketingplatform.google.com/about/analytics/terms/jp/"
        >
          Googleアナリティクスサービス利用規約
        </a>
        のページをご覧ください。
      </p>
      <h3 className="text-2xl font-bold my-4">
        プライバシーポリシーの変更について
      </h3>
      <p>
        当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。
        修正された最新のプライバシーポリシーは常に本ページにて開示されます。
      </p>
      <p className="my-8">初出掲載：2023年03月12日</p>
    </Layout>
  );
}

import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { firebaseApp } from "@/lib/firebase";
import { COLUMNS } from "@/lib/table";
import { setup } from "@/lib/csrf";
import Table from "@/components/Table";

export default function Home({ data }: any) {
  return (
    <>
      <NextHeadSeo
        title="SPBUploader"
        description="シンプルなSparebeatの譜面アップローダー"
        og={{
          title: "SPBUploader",
          description: "シンプルなSparebeatの譜面アップローダー",
          image: `${process.env.NEXT_PUBLIC_NEXT_SITE_URL}/img/ogp.png`,
        }}
        twitter={{
          card: "summary",
          site: "https://spb.wmsci.com",
        }}
      />
      <Layout className="px-4">
        <h2 className="text-3xl font-bold">譜面一覧</h2>
        <Table cols={COLUMNS} data={data} />
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

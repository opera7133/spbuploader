import Layout from "@/components/Layout";
import DataTable from "react-data-table-component";
import NextHeadSeo from "next-head-seo";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { firebaseApp } from "@/lib/firebase";

export default function Home({ data }: any) {
  const linked = data.map((doc: any) => ({
    ...doc,
    song: {
      ...doc.song,
      name: (
        <Link
          className="text-blue-500 duration-200 hover:text-blue-700"
          href={`/map/${doc.id}`}
        >
          {doc.song.name}
        </Link>
      ),
    },
    map: {
      ...doc.map,
      creator: (
        <Link
          className="text-blue-500 duration-200 hover:text-blue-700"
          href={`/user/${doc.uid}`}
        >
          {doc.map.creator}
        </Link>
      ),
    },
  }));
  const columns = [
    {
      name: "曲名",
      selector: (row: any) => row.song.name,
      sortable: true,
    },
    {
      name: "作曲者",
      selector: (row: any) => row.song.composer,
      sortable: true,
    },
    {
      name: "譜面制作者",
      selector: (row: any) => row.map.creator,
      sortable: true,
    },
    {
      name: "EASY",
      selector: (row: any) => row.map.easy,
      sortable: true,
    },
    {
      name: "NORMAL",
      selector: (row: any) => row.map.normal,
      sortable: true,
    },
    {
      name: "HARD",
      selector: (row: any) => row.map.hard,
      sortable: true,
    },
  ];
  return (
    <>
      <NextHeadSeo
        title="SPBUploader"
        description="シンプルなSparebeatの譜面アップローダー"
      />
      <Layout>
        <h2 className="text-3xl font-bold">譜面一覧</h2>
        <DataTable className="my-4" columns={columns} data={linked} />
      </Layout>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const db = getFirestore(firebaseApp);
  let data = (await getDocs(collection(db, "maps"))).docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return {
    props: {
      data,
    },
  };
}

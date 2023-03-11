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
  doc,
  getDoc,
} from "firebase/firestore";
import {
  BsCheckCircleFill,
  BsCheckCircle,
  BsXCircleFill,
} from "react-icons/bs";
import { firebaseApp } from "@/lib/firebase";
import Table from "@/components/Table";
import { COLUMNS } from "@/lib/table";

export default function Profile({ user }: any) {
  const data = user.maps;
  return (
    <Layout className="px-4">
      <NextHeadSeo
        title={`${user.name}のプロフィール - SPBUploader`}
        description="シンプルなSparebeatの譜面アップローダー"
        og={{
          title: `${user.name}のプロフィール - SPBUploader`,
          description: "シンプルなSparebeatの譜面アップローダー",
          image: `${process.env.NEXT_PUBLIC_NEXT_SITE_URL}/img/ogp.png`,
        }}
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
            <p className="block">{user.desc}</p>
            <a
              className="block mt-1 text-blue-500 duration-200 hover:text-blue-700"
              rel="noopener noreferrer"
              target="_blank"
              href={user.website}
            >
              {user.website}
            </a>
          </div>
        </header>
        <h2 className="text-xl font-bold">制作譜面一覧</h2>
        {data.length > 0 ? (
          <Table cols={COLUMNS} data={data} />
        ) : (
          <p className="my-4 bg-white py-4 px-2 text-center">
            まだこのユーザーは譜面を作成していません！
          </p>
        )}
        <h2 className="text-xl font-bold">お気に入り</h2>
        {user.favorites.length > 0 ? (
          <Table cols={COLUMNS} data={user.favorites} />
        ) : (
          <p className="my-4 bg-white py-4 px-2 text-center">
            このユーザーがお気に入りした譜面はありません！
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
  const userRef = doc(db, "users", user.uid);
  const q = query(
    mapsRef,
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );
  const userData = (await getDoc(userRef)).data();
  const data = (await getDocs(q)).docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt.toString(),
  }));
  const favs = userData?.favorites
    ? await Promise.all(
        userData.favorites.map(async (fav: any) => {
          const dataId = await getDoc(fav);
          const data = (await getDoc(fav)).data() as any;
          return {
            ...data,
            id: dataId.id,
            createdAt: data.createdAt.toDate().toString(),
          };
        })
      )
    : [];
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
        desc: userData?.desc || "",
        favorites: favs,
        website: userData?.website || "",
      },
    },
  };
}

import Layout from "@/components/Layout";
import { firebaseApp } from "@/lib/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsTrash3Fill, BsPencilFill, BsFillHeartFill } from "react-icons/bs";
import Script from "next/script";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { setup } from "@/lib/csrf";
import { format } from "date-fns";
import { getToken } from "next-auth/jwt";

export default function ShowMap({ user, id, data }: any) {
  const [width, setWidth] = useState(1.0);
  const [height, setHeight] = useState(640);
  const [timeline, setTimeline] = useState("");
  const [likeCount, setLikeCount] = useState(data.favoritesCount || 0);
  const [like, setLike] = useState<boolean>(
    user ? user.favorites.includes(id) : false
  );
  const router = useRouter();
  const setScale = () => {
    let scale = document.documentElement.clientWidth / 960;
    if (scale <= 1.0) setWidth(scale);
  };
  const deleteMap = async () => {
    const chk = confirm("譜面を削除します。よろしいですか？");
    if (chk) {
      const res = await (
        await fetch("/api/map/delete?id=" + id, { method: "POST" })
      ).json();
      if (res.status === "error") {
        toast.error(res.error);
      } else {
        toast.success("譜面を削除しました");
        router.push("/");
      }
    }
  };
  const favMap = async () => {
    const res = await (
      await fetch(`/api/map/favorite?id=${id}&fav=${like}`, {
        method: "POST",
      })
    ).json();
    if (res.status === "error") {
      toast.error(res.error);
    } else {
      toast.success(
        like ? "譜面のお気に入りを解除しました" : "譜面をお気に入りしました"
      );
      setLikeCount(like ? likeCount - 1 : likeCount + 1);
      setLike(!like);
    }
  };
  const updateTimeline = async () => {
    const res = await (
      await fetch(
        `/api/map/updateTimeline?id=${id}&timeline=${timeline.replace(
          "https://sparebeat.com/embed/timeline/",
          ""
        )}`,
        {
          method: "POST",
        }
      )
    ).json();
    if (res.status === "error") {
      toast.error(res.error);
    } else {
      toast.success("タイムラインURLを更新しました");
      router.reload();
    }
  };
  useEffect(() => {
    setScale();
    window.addEventListener("resize", () => {
      setScale();
    });
    window.outerWidth > 990 ? setHeight(640) : setHeight(1280);
  }, []);
  return (
    <Layout>
      <NextHeadSeo
        title={`${data.song.name} - SPBUploader`}
        description={`Music by ${data.song.composer}, Map by ${data.map.creator}`}
        og={{
          title: `${data.song.name} - SPBUploader`,
          description: `Music by ${data.song.composer}, Map by ${data.map.creator}`,
          image: `${process.env.NEXT_PUBLIC_NEXT_SITE_URL}/img/ogp.png`,
          siteName: "SPBUploader",
        }}
        customMetaTags={[
          {
            name: "keywords",
            content:
              "Sparebeat,スペアビート,Sparebeatアップローダー,スペアビートアップローダー,譜面投稿,音ゲー",
          },
        ]}
        twitter={{
          card: "summary",
          site: process.env.NEXT_PUBLIC_TWITTER_USER || "@scgame_m",
        }}
      />
      <div className="flex flex-col md:flex-row justify-between items-start px-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">{data.song.name}</h2>
          {data.map.desc && <p className="my-2">{data.map.desc}</p>}
          <p className="my-1">
            作曲：
            {data.song.composerUrl ? (
              <a
                className="text-blue-500 duration-200 hover:text-blue-700"
                href={data.song.composerUrl}
              >
                {data.song.composer}
              </a>
            ) : (
              data.song.composer
            )}
          </p>
          <p className="my-1">
            譜面：
            <Link
              className="text-blue-500 duration-200 hover:text-blue-700"
              href={`/user/${data.uid}`}
            >
              {data.map.creator}
            </Link>
          </p>
          <p className="my-1">
            追加日：{format(new Date(data.createdAt), "yyyy/MM/dd")}
          </p>
          <p>お気に入り数：{likeCount}</p>
        </div>

        <div className="flex items-center gap-2">
          {user && data.uid === user.uid && (
            <button
              onClick={deleteMap}
              className="p-3 duration-200 rounded-full hover:bg-gray-300"
            >
              <BsTrash3Fill size={20} />
            </button>
          )}
          {user && data.uid !== user.uid && (
            <button
              onClick={favMap}
              className="p-3 duration-200 rounded-full hover:bg-gray-300"
            >
              <BsFillHeartFill
                size={20}
                className={like ? "fill-rose-500" : "fill-gray-400"}
              />
            </button>
          )}
        </div>
      </div>
      <div className="my-4">
        <iframe
          width="960"
          height={height}
          style={{ transform: `scale(${width})` }}
          id="sparebeat"
          src="https://sparebeat.com/embed/"
          className="origin-top-left border-0"
        ></iframe>
        <Script id={data.id} strategy="afterInteractive">{`Sparebeat.load(
          "${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/maps/${id}/${data.map.fileName}",
          "${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/maps/${id}/${data.song.fileName}"
        );`}</Script>
      </div>
      {user && data.uid === user.id && (
        <div>
          <h2 className="text-xl font-bold my-2">
            {data.timeline ? "タイムラインURLを変更" : "タイムラインURLを設定"}
          </h2>
          <div className="flex flex-row items-center gap-2">
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="タイムラインURL"
              className="bg-white py-1.5 rounded-md"
            />
            <button
              onClick={updateTimeline}
              className="bg-fuchsia-600 text-white px-5 py-1.5 rounded-md duration-200 hover:bg-fuchsia-500"
            >
              保存
            </button>
          </div>
        </div>
      )}
      {data.timeline && (
        <div className="my-4">
          <object
            data={`https://sparebeat.com/embed/timeline/${data.timeline}`}
            width="100%"
            height={600}
            className="border-0 overflow-y-scroll"
          ></object>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    if (!ctx.query.id) return { notFound: true };
    const token = await getToken({
      req: ctx.req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const id = ctx.query.id.toString();
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "maps", id);
    const docSnap = (await getDoc(docRef)).data();
    if (!docSnap) return { notFound: true };
    docSnap.createdAt = docSnap.createdAt.toDate().toString();
    if (token) {
      const user = JSON.parse(JSON.stringify(token, null, 2));
      const userRef = doc(db, "users", user.uid);
      const userData = (await getDoc(userRef)).data();
      const favs = userData?.favorites
        ? await Promise.all(
            userData.favorites.map(async (fav: any) => {
              return (await getDoc(fav)).id;
            })
          )
        : [];
      return {
        props: {
          id: id,
          data: docSnap,
          user: {
            ...user,
            favorites: favs,
          },
        },
      };
    }
    return {
      props: {
        id: id,
        data: docSnap,
      },
    };
  }
);

import Layout from "@/components/Layout";
import { setup } from "@/lib/csrf";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import NextHeadSeo from "next-head-seo";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

type Inputs = {
  song: {
    name: string;
    composer: string;
    file: FileList;
  };
  map: {
    desc: string;
    file: FileList;
  };
};

export default function Upload() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (session && session.user) {
      const formData = new FormData();
      formData.append("song[name]", data.song.name);
      formData.append("song[composer]", data.song.composer);
      formData.append("song[file]", data.song.file[0]);
      formData.append("map[file]", data.map.file[0]);
      formData.append("map[desc]", data.map.desc);
      const res = await (
        await fetch("/api/map/create", {
          method: "POST",
          body: formData,
        })
      ).json();
      if (res.status === "error") {
        toast.error(res.error);
      } else {
        toast.success("譜面を投稿しました");
        router.push(`/map/${res.id}`);
      }
    }
  };
  if (session && session.user)
    return (
      <Layout>
        <NextHeadSeo
          title="追加 - SPBUploader"
          description="シンプルなSparebeatの譜面アップローダー"
        />
        <div className="px-4">
          <h2 className="text-3xl font-bold mb-3">追加</h2>
          <p>このページからあなたの制作した譜面を投稿できます。</p>
        </div>
        <form
          className="bg-white my-4 px-8 py-4 rounded-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="my-3 flex flex-col gap-1">
            <label htmlFor="songname">曲名</label>
            <input
              type="text"
              id="songname"
              {...register("song.name", {
                required: true,
              })}
              className={twMerge(
                "bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.song?.name && "ring-red-500 ring-2"
              )}
            />
          </div>
          <div className="my-3 flex flex-col gap-1">
            <label htmlFor="composer">作曲者名</label>
            <input
              type="text"
              id="composer"
              {...register("song.composer", {
                required: true,
              })}
              className={twMerge(
                "bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.song?.composer && "ring-red-500 ring-2"
              )}
            />
          </div>
          <div className="my-3 flex flex-col gap-1">
            <label htmlFor="songfile">音楽ファイル</label>
            <input
              type="file"
              id="songfile"
              aria-describedby="song_input_help"
              accept="audio/mpeg"
              {...register("song.file", {
                required: true,
              })}
              className={twMerge(
                "bg-gray-100 border-0 file:duration-200 file:mr-2 file:px-3 file:py-2 file:border-0 file:bg-fuchsia-600 file:text-white file:hover:bg-fuchsia-500 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.song?.file && "ring-red-500 ring-2"
              )}
            />
            <p className="mt-1 text-sm text-gray-600" id="song_input_help">
              MP3
            </p>
          </div>
          <div className="my-3 flex flex-col gap-1">
            <label htmlFor="mapfile">譜面ファイル</label>
            <input
              type="file"
              id="mapfile"
              aria-describedby="map_input_help"
              accept="application/json"
              {...register("map.file", {
                required: true,
              })}
              className={twMerge(
                "bg-gray-100 border-0 file:duration-200 file:mr-2 file:px-3 file:py-2 file:border-0 file:bg-fuchsia-600 file:text-white file:hover:bg-fuchsia-500 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.song?.file && "ring-red-500 ring-2"
              )}
            />
            <p className="mt-1 text-sm text-gray-600" id="map_input_help">
              JSON
            </p>
          </div>
          <div className="my-3 flex flex-col gap-1">
            <label htmlFor="desc">説明</label>
            <textarea
              id="desc"
              {...register("map.desc", { maxLength: 255 })}
              className={twMerge(
                "bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.map?.desc && "ring-red-500 ring-2"
              )}
            />
            <p className="mt-1 text-sm text-gray-600">
              最大255文字、改行は全て無視されます。
            </p>
          </div>
          <button className="w-full bg-fuchsia-600 text-white py-2 rounded-md mt-4 duration-200 hover:bg-fuchsia-500">
            アップロード
          </button>
        </form>
      </Layout>
    );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    return { props: {} };
  }
);

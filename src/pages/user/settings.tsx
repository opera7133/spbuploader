import Layout from "@/components/Layout";
import Image from "next/image";
import NextHeadSeo from "next-head-seo";
import { useForm, SubmitHandler } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";
import {
  getAuth,
  updateProfile,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  sendEmailVerification,
  reauthenticateWithRedirect,
  GithubAuthProvider,
} from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import imageCompression from "browser-image-compression";
import { twMerge } from "tailwind-merge";
import { setup } from "@/lib/csrf";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

type Inputs = {
  username: string;
  desc: string;
  email: string;
  website: string;
  oldPass?: string;
  newPass?: string;
  newPassConfirm?: string;
};

export default function Settings({ user }: any) {
  const auth = getAuth(firebaseApp);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();
  const [img, setImg] = useState(user.photoURL);
  const sendConfirmMail = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
    toast.success("確認メールを送信しました");
  };

  const deleteAccount = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    const chk = confirm(
      "アカウントを削除すると、投稿した譜面は全て削除されます。よろしいですか？"
    );
    if (chk) {
      const oldPass = getValues("oldPass");
      if (auth.currentUser && oldPass) {
        const db = getFirestore(firebaseApp);
        await deleteDoc(doc(db, "users", user.uid));
        const mapDocs = getDocs(
          query(collection(db, "maps"), where("uid", "==", user.uid))
        ).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
        });
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email || "",
          oldPass
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await deleteUser(auth.currentUser);
        signOut();
      }
    }
  };

  const onChangeInputFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const compressed = await imageCompression(file, {
        maxSizeMB: 10,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        setImg(e.target.result);
      };
      reader.readAsDataURL(compressed);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (auth.currentUser) {
        if (img) {
          const uploadedUrl = await (
            await fetch("/api/utils/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "avatar",
                filename: `${auth.currentUser.uid}`,
                content: img,
              }),
            })
          ).json();
          await updateProfile(auth.currentUser, {
            photoURL: uploadedUrl.url,
          });
        } else {
          await updateProfile(auth.currentUser, {
            photoURL: "",
          });
        }
        await updateProfile(auth.currentUser, {
          displayName: data.username,
        });
        const db = getFirestore(firebaseApp);
        const testUser = (await getDoc(doc(db, "users", user.uid))).data();
        if (testUser) {
          const updateUser = await updateDoc(doc(db, "users", user.uid), {
            desc: data.desc,
            website: data.website,
          });
        } else {
          const createUser = await setDoc(doc(db, "users", user.uid), {
            desc: data.desc,
            website: data.website,
          });
        }
        if (
          data.oldPass &&
          data.newPass &&
          data.newPassConfirm &&
          data.oldPass !== data.newPass
        ) {
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email || "",
            data.oldPass
          );
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updatePassword(auth.currentUser, data.newPass);
        }
        if (data.email !== auth.currentUser.email && data.oldPass) {
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email || "",
            data.oldPass
          );
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updateEmail(auth.currentUser, data.email);
        }
        toast.success("ユーザー情報を保存しました");
        router.reload();
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };
  if (user)
    return (
      <Layout>
        <NextHeadSeo
          title="ユーザー設定 - SPBUploader"
          description="シンプルなSparebeatの譜面アップローダー"
          robots="noindex, nofollow"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white px-8 py-4 rounded-md flex flex-col items-start"
        >
          <h2 className="text-2xl font-bold my-4">ユーザー設定</h2>
          <h3 className="text-xl font-bold my-3">プロフィール</h3>
          <label className="relative inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChangeInputFile(e)}
              className="hidden"
            />
            <Image
              src="/img/upload.svg"
              alt="Upload"
              width={150}
              height={150}
              className="rounded-full object-cover"
            />
            <Image
              src={img || "/img/avatar.png"}
              alt="Avatar"
              width={150}
              height={150}
              className="rounded-full object-cover absolute top-0 duration-200 hover:opacity-50"
            />
          </label>
          <button
            onClick={(e) => {
              e.preventDefault();
              setImg("");
            }}
            className="bg-gray-900 text-white px-5 py-2 rounded-md mt-4 duration-200 hover:bg-gray-800"
          >
            デフォルトに戻す
          </button>

          <div className="my-3 max-w-lg flex flex-col gap-1">
            <label htmlFor="username">ユーザー名</label>
            <input
              type="text"
              id="username"
              defaultValue={user.displayName || ""}
              {...register("username", {
                required: true,
              })}
              className={twMerge(
                "bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.username && "ring-red-500 ring-2"
              )}
            />
          </div>
          <div className="my-3 max-w-lg w-full flex flex-col gap-1">
            <label htmlFor="desc">説明</label>
            <textarea
              id="desc"
              defaultValue={user.desc || ""}
              {...register("desc")}
              rows={5}
              className={twMerge(
                "w-full bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.desc && "ring-red-500 ring-2"
              )}
            />
          </div>
          <div className="my-3 max-w-lg w-full flex flex-col gap-1">
            <label htmlFor="website">ウェブサイト</label>
            <input
              type="text"
              id="website"
              defaultValue={user.website || ""}
              {...register("website", {
                pattern:
                  /(mailto:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)|(((?:https?)|(?:ftp)):\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
              })}
              placeholder="https://..."
              className={twMerge(
                "bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.website && "ring-red-500 ring-2"
              )}
            />
          </div>
          <div className="my-3 max-w-lg flex flex-col gap-1">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              defaultValue={user.email || ""}
              {...register("email", {
                required: true,
              })}
              className={twMerge(
                "bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                errors.email && "ring-red-500 ring-2"
              )}
            />
            <span className="text-sm">
              メールアドレスを変更する場合、
              <b>現在のパスワード欄にパスワードを入力してください</b>。
            </span>
          </div>
          {!user.emailVerified && (
            <p className="font-bold text-sm text-red-500">
              メールアドレスが確認されていません。
              <button
                onClick={sendConfirmMail}
                className="text-blue-500 hover:underline"
              >
                確認メールを送信
              </button>
            </p>
          )}
          <h3 className="text-xl font-bold my-3">セキュリティ</h3>
          <div className="my-3 max-w-lg flex flex-col gap-1">
            <label htmlFor="oldPass">現在のパスワード</label>
            <input
              type="password"
              id="oldPass"
              placeholder="••••••••"
              {...register("oldPass")}
              className="bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md"
            />
          </div>
          <div className="my-3 max-w-lg flex flex-col gap-1">
            <label htmlFor="newPass">新しいパスワード</label>
            <input
              type="password"
              id="newPass"
              placeholder="••••••••"
              {...register("newPass")}
              className="bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md"
            />
          </div>
          <div className="my-3 max-w-lg flex flex-col gap-1">
            <label htmlFor="newPassConfirm">新しいパスワード（確認）</label>
            <input
              type="password"
              id="newPassConfirm"
              placeholder="••••••••"
              {...register("newPassConfirm", {
                validate: (input) => input === getValues("newPass"),
              })}
              className="bg-gray-100 border-0 px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md"
            />
          </div>
          <h3 className="text-xl font-bold my-3">アカウントの削除</h3>
          <span className="text-sm">
            アカウントを削除する場合、
            <b>現在のパスワード欄にパスワードを入力してください</b>。
          </span>
          <button
            onClick={deleteAccount}
            className="bg-red-600 text-white px-5 py-1.5 rounded-md my-4 duration-200 hover:bg-red-500"
          >
            アカウントを削除
          </button>
          <button className="bg-fuchsia-600 text-white px-5 py-1.5 rounded-md mt-4 duration-200 hover:bg-fuchsia-500">
            保存
          </button>
        </form>
      </Layout>
    );
}

export const getServerSideProps = setup(
  async (ctx: GetServerSidePropsContext) => {
    const token = await getToken({
      req: ctx.req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (token) {
      const user = JSON.parse(
        JSON.stringify(await firebaseAdmin.auth().getUser(token.uid))
      );
      console.log(user);
      const db = getFirestore(firebaseApp);
      const userRef = doc(db, "users", user.uid);
      const userData = (await getDoc(userRef)).data();
      return {
        props: {
          user: {
            ...user,
            desc: userData?.desc || "",
            website: userData?.website || "",
          },
        },
      };
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }
);

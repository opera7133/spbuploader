import { signIn, useSession } from "next-auth/react";
import NextHeadSeo from "next-head-seo";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import type { AuthProvider } from "firebase/auth";
import { BsGithub, BsGoogle, BsFillEnvelopeFill } from "react-icons/bs";
import { useForm, SubmitHandler } from "react-hook-form";
import { firebaseApp } from "@/lib/firebase";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { useRouter } from "next/router";

type SignUpInputs = {
  name: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const { data: session } = useSession();
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const githubProvider = new GithubAuthProvider();
  const googleProvider = new GoogleAuthProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (credential) => {
        const user = credential.user;
        await updateProfile(user, {
          displayName: data.name,
        });
        return credential.user.getIdToken(true);
      })
      .then((idToken) => {
        signIn("credentials", { idToken });
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const handleOAuthSignIn = (provider: AuthProvider) => {
    signInWithPopup(auth, provider)
      .then((credential) => credential.user.getIdToken(true))
      .then((idToken) => {
        signIn("credentials", { idToken });
      })
      .catch((e) => {
        if (e.code !== "auth/popup-closed-by-user") {
          toast.error(e.message);
        }
      });
  };
  if (session) {
    router.push("/");
    return null;
  } else {
    return (
      <Layout className="flex">
        <NextHeadSeo
          title="新規登録 - SPBUploader"
          description="シンプルなSparebeatの譜面アップローダー"
          robots="noindex, nofollow"
        />
        <div className="grid place-items-center h-full max-w-lg px-4">
          <div className="flex flex-col gap-3 bg-white px-8 py-6 rounded-md w-full">
            <h2 className="text-3xl font-bold">新規登録</h2>
            <p>
              アカウントをお持ちですか？
              <Link
                className="text-blue-500 duration-200 hover:text-blue-700 hover:underline"
                href="/user/signin"
              >
                ログイン
              </Link>
            </p>
            <form
              id="signup-form"
              className="my-4 text-left flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label htmlFor="name">ユーザー名</label>
                <div className="mt-1 flex flex-col gap-1">
                  <input
                    className={twMerge(
                      "bg-gray-100 border-0 text-lg px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                      errors.name && "ring-red-500 ring-2"
                    )}
                    type="text"
                    {...register("name", { required: true })}
                    id="name"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email">メールアドレス</label>
                <div className="mt-1 flex flex-col gap-1">
                  <input
                    className={twMerge(
                      "bg-gray-100 border-0 text-lg px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                      errors.email && "ring-red-500 ring-2"
                    )}
                    type="email"
                    {...register("email", { required: true })}
                    id="email"
                    placeholder="username@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password">パスワード</label>
                <div className="mt-1 flex flex-col gap-1">
                  <input
                    className={twMerge(
                      "bg-gray-100 border-0 text-lg px-3 py-2 focus:outline-none focus:border-0 focus:ring-black focus:ring-2 duration-200 text-black rounded-md",
                      errors.email && "ring-red-500 ring-2"
                    )}
                    type="password"
                    {...register("password", {
                      required: true,
                    })}
                    id="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </form>
            <div className="flex flex-col gap-3">
              <button
                className="inline-block gap-3 bg-fuchsia-600 duration-200 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-md"
                type="submit"
                form="signup-form"
              >
                <span>登録</span>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

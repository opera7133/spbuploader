import { signIn, useSession } from "next-auth/react";
import NextHeadSeo from "next-head-seo";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { BsGithub, BsGoogle, BsFillEnvelopeFill } from "react-icons/bs";
import { useForm, SubmitHandler } from "react-hook-form";
import type { AuthProvider } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";

type LoginInputs = {
  email: string;
  password: string;
};

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const githubProvider = new GithubAuthProvider();
  const googleProvider = new GoogleAuthProvider();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const loadToast = toast.loading("ログイン中です...");
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((credential) => credential.user.getIdToken(true))
      .then((idToken) => {
        toast.dismiss(loadToast);
        signIn("credentials", { idToken, callbackUrl: window.location.origin });
      })
      .catch((e) => {
        toast.dismiss(loadToast);
        toast.error(e.message);
      });
  };

  const handleOAuthSignIn = (provider: AuthProvider) => {
    signInWithPopup(auth, provider)
      .then((credential) => credential.user.getIdToken(true))
      .then((idToken) => {
        signIn("credentials", { idToken, callbackUrl: window.location.origin });
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
          title="ログイン - SPBUploader"
          description="シンプルなSparebeatの譜面アップローダー"
          robots="noindex, nofollow"
        />
        <div className="grid place-items-center h-full max-w-lg px-4">
          <div className="flex flex-col gap-3 bg-white px-8 py-6 rounded-md w-full">
            <h2 className="text-3xl font-bold">ログイン</h2>
            <p>
              初めての利用ですか？
              <Link
                className="text-blue-500 duration-200 hover:text-blue-700 hover:underline"
                href="/user/signup"
              >
                新規登録
              </Link>
            </p>
            <form
              id="signin-form"
              className="my-4 text-left flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                form="signin-form"
              >
                <span>ログイン</span>
              </button>
            </div>
            <p className="">
              パスワードをお忘れですか？
              <Link
                className="text-blue-500 duration-200 hover:text-blue-700 hover:underline"
                href="/user/reset"
              >
                パスワードをリセット
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    );
  }
}

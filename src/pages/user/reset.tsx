import { signIn, useSession } from "next-auth/react";
import NextHeadSeo from "next-head-seo";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import { firebaseApp } from "@/lib/firebase";
import Layout from "@/components/Layout";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

type LoginInputs = {
  email: string;
};

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    await sendPasswordResetEmail(auth, data.email);
    toast.success("パスワードリセットのメールを送信しました");
  };
  if (session) {
    router.push("/");
    return null;
  } else {
    return (
      <Layout className="flex">
        <NextHeadSeo
          title="パスワードをリセット - SPBUploader"
          description="シンプルなSparebeatの譜面アップローダー"
          robots="noindex, nofollow"
        />
        <div className="grid place-items-center h-full max-w-lg px-4">
          <div className="flex flex-col gap-3 bg-white px-8 py-6 rounded-md w-full">
            <h2 className="text-3xl font-bold">パスワードをリセット</h2>
            <form
              id="reset-form"
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
            </form>
            <div className="flex flex-col gap-3">
              <button
                className="inline-block gap-3 bg-fuchsia-600 duration-200 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-md"
                type="submit"
                form="signin-form"
              >
                <span>メールを送信</span>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

import Layout from "@/components/Layout";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import {
  BsCheckCircleFill,
  BsCheckCircle,
  BsXCircleFill,
} from "react-icons/bs";
import { useSession } from "next-auth/react";

export default function Profile({ user }: any) {
  const { data: session } = useSession();
  return (
    <Layout>
      <NextHeadSeo
        title={`${user.name}のプロフィール - SPBUploader`}
        description="シンプルなSparebeatの譜面アップローダー"
      />
      <div>
        <header className="mb-12 flex flex-row items-start gap-5">
          <Image
            src={user.avatar || "/img/avatar.png"}
            alt="Avatar"
            width={150}
            height={150}
            className="rounded-full object-cover"
          />
          <div className="mt-5">
            <h2 className="text-4xl font-bold">{user.name}</h2>
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
          </div>
        </header>
        <h2 className="text-xl font-bold">制作譜面一覧</h2>
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
  return {
    props: {
      user: {
        uid: user.uid,
        avatar: user.photoURL || "",
        email: user.email,
        verified: user.emailVerified,
        disabled: user.disabled,
        name: user.displayName,
      },
    },
  };
}

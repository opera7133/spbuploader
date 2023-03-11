import Layout from "@/components/Layout";
import Table from "@/components/Table";
import { setup } from "@/lib/csrf";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import { USERCOLUMNS } from "@/lib/table";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import NextHeadSeo from "next-head-seo";
import { useState } from "react";

import toast from "react-hot-toast";

export default function AdminHome({ user, users }: any) {
  const [uid, setUid] = useState("");
  const [roles, setRoles] = useState("");
  const setRole = async () => {
    if (uid && roles) {
      const res = await (
        await fetch("/api/admin/setRole", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: uid,
            role: roles.split(","),
          }),
        })
      ).json();
      if (res.status === "error") {
        toast.error(res.error);
      } else {
        toast.success("ロールを設定しました");
      }
    }
  };
  return (
    <Layout>
      <NextHeadSeo
        title="管理画面 - SPBUploader"
        description="シンプルなSparebeatの譜面アップローダー"
        robots="noindex, nofollow"
      />
      <h2 className="text-3xl font-bold my-4">管理者コンソール</h2>
      <p>無効化・削除・パスワード再設定 → Firebaseコンソール</p>
      <h3 className="text-2xl font-bold my-3">ロールのアサイン</h3>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="py-2 rounded-md"
          placeholder="ユーザーID"
        />
        <input
          type="text"
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
          className="py-2 rounded-md"
          placeholder="ロール（カンマ区切り文字列）"
        />
        <button
          onClick={setRole}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white duration-200 px-4 py-2 rounded-md"
        >
          設定
        </button>
      </div>
      <h3 className="text-2xl font-bold my-3">ユーザー一覧</h3>
      <Table cols={USERCOLUMNS} data={users} />
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
      const currentUser = JSON.parse(JSON.stringify(token, null, 2));
      const claims = (await firebaseAdmin.auth().getUser(currentUser.uid))
        .customClaims?.roles;
      if (claims.includes("admin")) {
        const users = JSON.parse(
          JSON.stringify(
            (await firebaseAdmin.auth().listUsers()).users.map((user) =>
              user.toJSON()
            )
          )
        );
        return {
          props: {
            user: currentUser,
            users,
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

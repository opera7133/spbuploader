import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Firebase Auth",
      // @ts-ignore
      async authorize(credentials: { idToken: string }, req) {
        const { idToken } = credentials;
        if (idToken != null) {
          try {
            const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
            return { ...decoded };
          } catch (error) {
            console.log("Failed to verify ID token:", error);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        // @ts-ignore
        token = user;
      }
      return token;
    },
    session: ({ session, token }) => {
      //@ts-ignore
      session.user = token
      return session
    },
  },
  pages: {
    signIn: "/user/signin",
    newUser: "/user",
  }
});

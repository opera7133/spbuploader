import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    email_verified: boolean;
    photoURL?: string;
    picture?: string;
    uid: string;
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email_verified: boolean;
    photoURL?: string;
    picture?: string;
    uid: string;
  }
}
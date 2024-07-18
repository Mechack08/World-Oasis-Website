import NextAuth, { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

interface CustomUser {
  id: string;
  name: string;
  email: string;
  image: string;
  guestId?: number; // Optional guestId property
}

const authConfig: NextAuthConfig = {
  providers: [
    google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email!);

        if (!existingGuest) {
          await createGuest({ email: user.email!, fullName: user.name! });
        }

        return true;
      } catch {
        return false;
      }
    },
    // async session({ session, user }: {session:any, user: CustomUser}) {
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      (session.user as CustomUser).guestId = guest.id;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);

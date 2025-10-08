import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data: authData, error: authError } =
            await supabaseAdmin.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });

          if (authError || !authData.user) {
            return null;
          }

          const { first_name, last_name, company_name } =
            authData.user.user_metadata || {};

          return {
            id: authData.user.id,
            email: authData.user.email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || null,
            firstName: first_name,
            lastName: last_name,
            companyName: company_name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.companyName = (user as any).companyName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).firstName = token.firstName as string;
        (session.user as any).lastName = token.lastName as string;
        (session.user as any).companyName = token.companyName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

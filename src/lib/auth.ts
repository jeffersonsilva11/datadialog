import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CustomPrismaAdapter } from "./adapter";

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/analytics.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log("[AuthCallback] session callback", { session, user });
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("[AuthCallback] signIn callback", {
        user: user?.email,
        account: account?.provider,
        profile: profile?.email
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("[AuthCallback] redirect", { url, baseUrl });
      // Se a URL já é do mesmo domínio, usa ela
      if (url.startsWith(baseUrl)) return url;
      // Se começa com /, adiciona o baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Caso contrário, vai para o dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log("[AuthEvent] signIn event", {
        userId: user.id,
        provider: account?.provider
      });
    },
    async session({ session }) {
      console.log("[AuthEvent] session event", { userId: session.user?.id });
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
};

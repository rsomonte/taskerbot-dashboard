import NextAuth, { AuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        // @ts-expect-error - token.sub is the user ID
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const scope = ["https://www.googleapis.com/auth/youtube.readonly","https://www.googleapis.com/auth/yt-analytics.readonly"];

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: { 
        params: { 
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        } 
      }
    }),
  ],
  jwt: {
    encryption: true,
  },
  secret: process.env.SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    },
  }
})
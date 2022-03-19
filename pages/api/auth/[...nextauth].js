import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const scope = ["https://www.googleapis.com/auth/youtube.readonly","https://www.googleapis.com/auth/yt-analytics.readonly"];

export default NextAuth({
  // Configure one or more authentication providers
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

// curl 'https://youtubeanalytics.googleapis.com/v2/reports?dimensions=elapsedVideoTimeRatio&endDate=2022-01-01&filters=video%3D%3DYPRRYC2Gu08%3BaudienceType%3D%3DORGANIC&ids=channel%3D%3DMINE&metrics=audienceWatchRatio%2CrelativeRetentionPerformance&startDate=2014-05-01&key=AIzaSyBlkQVlN2VjTBTI1YuluGB4YY6DhKwEVhI' \
//   --header 'Authorization: Bearer ya29.A0ARrdaM-Y3q7tLkplroQUMQDmWypD9B_LEGbjdS0DB9V4L131V-GqnIDeRTQ3PVUnWBDH5jpGihzmOd1CirWfnWd7T8_kM8Z1XgApAWcm3rr0wBeDKnWtfvw47jzgyfKqdWYw7rEAtXICBZkHN_7rgc72bQU0' \
//   --header 'Accept: application/json' \
//   --compressed
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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



// --- REFRESH TOKEN ---

// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"

// const GOOGLE_AUTHORIZATION_URL =
//   "https://accounts.google.com/o/oauth2/v2/auth?" +
//   new URLSearchParams({
//     scope:
//     "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
//     prompt: "consent",
//     access_type: "offline",
//     response_type: "code",
//   })

// /**
//  * Takes a token, and returns a new token with updated
//  * `accessToken` and `accessTokenExpires`. If an error occurs,
//  * returns the old token and an error property
//  */
// async function refreshAccessToken(token) {
//   try {
//     const url =
//       "https://oauth2.googleapis.com/token?" +
//       new URLSearchParams({
//         client_id: process.env.GOOGLE_ID,
//         client_secret: process.env.GOOGLE_SECRET,
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken,
//       })

//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     })

//     const refreshedTokens = await response.json()

//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     }
//   }
// }

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       authorization: GOOGLE_AUTHORIZATION_URL,
//     }),
//   ],
//   jwt: {
//     encryption: true,
//   },
//   secret: process.env.SECRET,
//   pages: {
//     signIn: '/login'
//   },
//   callbacks: {
//     async jwt({ token, user, account }) {
//       // Initial sign in
//       if (account && user) {
//         return {
//           accessToken: account.access_token,
//           accessTokenExpires: Date.now() + account.expires_in * 1000,
//           refreshToken: account.refresh_token,
//           user,
//         }
//       }

//       // Return previous token if the access token has not expired yet
//       if (Date.now() < token.accessTokenExpires) {
//         return token
//       }

//       // Access token has expired, try to update it
//       return refreshAccessToken(token)
//     },
//     async session({ session, token }) {
//       session.user = token.user
//       session.accessToken = token.accessToken
//       session.error = token.error

//       return session
//     },
//   },
// })
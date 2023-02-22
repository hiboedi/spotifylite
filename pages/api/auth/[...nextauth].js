import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      //   Merefresh token ketika user kembali ke aplikasi
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "refreshAccessTokenError",
    };
  }
}

export const authOptions = {
  // Konfigurasi seluruh Providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // line khusu penambahan provider
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Pengecekan akun user
      if (account && user) {
        return {
          ...token,
          accessToken: account.acces_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // just multiplyy with 1000 milli second
        };
      }
      //   Merefresh token
      if (Date.now() < token.accessTokenExpires) {
        console.log("The Token is VALID");
        return token;
      }
      //   Menrefresh token yang telah kadaluarsa
      console.log("The Token is UNVALID");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      (session.user.accessToken = token.accessToken),
        (session.user.refreshToken = token.refreshToken),
        (session.user.username = token.username);

      return session;
    },
  },
};

export default NextAuth(authOptions);

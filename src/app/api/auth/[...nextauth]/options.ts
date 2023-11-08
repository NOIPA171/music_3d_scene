import type { NextAuthOptions } from "next-auth";

import SpotifyProvider from "next-auth/providers/spotify";

const spotifyScopes = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
].join(" ");
export const options: NextAuthOptions = {
  // custom sign in page
  pages: {
    // signIn: '/auth/signin'
  },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes}`,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        console.log(account);
        console.log(token);
        token.accessToken = account.access_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
      } else if (token.expires_at && Date.now() >= token.expires_at * 1000) {
        console.log("token", token);
        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: token.refresh_token as string,
            client_id: process.env.SPOTIFY_CLIENT_ID,
          }),
        });

        const response = await res.json();
        if (!response.ok || response.error === "invalid_request") {
          token.error = "RefreshAccessTokenError";
        }
        // TBD: refresh token
        console.log("response", response);
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};

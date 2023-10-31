import type { NextAuthOptions } from "next-auth";

import SpotifyProvider from "next-auth/providers/spotify";
export const options: NextAuthOptions = {
  // custom sign in page
  pages: {
    // signIn: '/auth/signin'
  },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      //   profile(profile) {
      //     return {
      //       id: profile.id,
      //       name: profile.display_name,
      //       email: profile.email,
      //       image: profile.images?.[0]?.url,
      //     };
      //   },
    }),
  ],
};

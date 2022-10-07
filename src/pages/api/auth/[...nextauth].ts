import NextAuth, { type NextAuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server.mjs';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/',
  },
  // Include user.id on session
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = user.id;
      }

      if (token) {
        session.accessToken = token.accessToken;
      }

      session.error = token?.error;
      return session;
    },
    redirect({ baseUrl }) {
      return `${baseUrl}/room`;
    },
    async jwt({ token, user, account }) {
      console.log({ token });
      console.log({ user });
      console.log({ account });
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + (account.expires_at ?? 0) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            'streaming user-read-email user-modify-playback-state user-read-private user-read-playback-state user-read-currently-playing user-read-recently-played',
        },
      },
    }),
  ],
};

const refreshAccessToken = async (token: JWT) => {
  console.log({ token });
  try {
    const url = 'https://accounts.spotify.com/v1/refresh';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const query = new URLSearchParams({
      refresh_token: token.refreshToken ?? '',
    });

    const response = await fetch(url + query, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const tokens = await response.json();
    return {
      ...token,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log({ error });

    return {
      ...token,
      error: 'refreshAccessTokenError',
    };
  }
};

export default NextAuth(authOptions);

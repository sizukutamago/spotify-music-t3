import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const spotifyRouter = createRouter()
  .query('search', {
    input: z.object({
      roomId: z.string(),
      searchText: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const room = await ctx.prisma.room.findFirst({
          select: {
            userId: true,
          },
          where: {
            id: input.roomId,
          },
        });

        const account = await ctx.prisma.account.findFirst({
          select: {
            access_token: true,
          },
          where: {
            userId: room?.userId,
            provider: 'spotify',
          },
        });

        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&include_external=audio&q=${input.searchText}&market=JP`,
          {
            headers: {
              Authorization: `Bearer ${account?.access_token}`,
            },
          }
        );

        return await response.json();
      } catch (error) {
        console.log(error);
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    console.log({ ctx });

    return next();
  })
  .mutation('play', {
    input: z.object({
      roomId: z.string(),
      deviceId: z.string(),
      uri: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const account = await ctx.prisma.account.findFirst({
          select: {
            access_token: true,
          },
          where: {
            userId: ctx.session?.userId as string,
            provider: 'spotify',
          },
        });

        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${input.deviceId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${account?.access_token}`,
            },
            body: JSON.stringify({
              context_uri: input.uri,
              position_ms: 0,
            }),
          }
        );

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  });

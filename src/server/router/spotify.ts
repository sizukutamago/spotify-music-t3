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
  .query('getPlayList', {
    input: z.object({
      roomId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.playList.findMany({
          select: {
            id: true,
            uri: true,
            image_url: true,
            name: true,
          },
          where: {
            AND: [
              {
                roomId: input.roomId,
                played: false,
              },
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation('addPlayList', {
    input: z.object({
      roomId: z.string(),
      uri: z.string(),
      imageUrl: z.string(),
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.playList.create({
          data: {
            roomId: input.roomId,
            uri: input.uri,
            image_url: input.imageUrl,
            name: input.name,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next();
  })
  .mutation('play', {
    input: z.object({
      id: z.string(),
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

        return await ctx.prisma.playList.update({
          where: {
            id: input.id,
          },
          data: {
            played: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

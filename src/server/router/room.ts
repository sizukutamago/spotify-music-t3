import { createRouter } from './context';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const roomRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .query('getRoomById', {
    input: z.object({
      roomId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.room.findFirst({
          select: {
            id: true,
            userId: true,
          },
          where: {
            id: input.roomId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation('createRoom', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.room.create({
          data: {
            userId: input.userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

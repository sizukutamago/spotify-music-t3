import { createRouter } from './context';
import { TRPCError } from '@trpc/server';

export const userRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .query('getUser', {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.user.findFirst({
          select: {
            accounts: true,
          },
          where: {
            id: ctx.session?.user?.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

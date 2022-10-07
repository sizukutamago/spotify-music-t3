// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';
import { roomRouter } from './room';
import { userRouter } from './user';
import { spotifyRouter } from './spotify';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('room.', roomRouter)
  .merge('user.', userRouter)
  .merge('spotify.', spotifyRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

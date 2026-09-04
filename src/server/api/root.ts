import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { certificateRouter } from "./routers/certificate";
import { experienceRouter } from "./routers/experience";
import { portfolioRouter } from "./routers/portfolio";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  portfolio: portfolioRouter,
  experience: experienceRouter,
  certificate: certificateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

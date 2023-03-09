import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { createContext, router } from "../router"
import { userRouter } from "./user"

// defines the procedures
export const appRouter = router({
  user: userRouter,
})

/**
 * Handles requests to the trpc API endpoint.
 */
export const requestHandler = ({ request }: { request: Request }) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  })

export type AppRouter = typeof appRouter

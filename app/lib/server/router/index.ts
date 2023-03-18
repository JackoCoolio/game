import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { createContext, router } from "~/lib/server/trpc"
import type { SessionData } from "../session"
import { commitSession, getSession } from "../session"
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
    createContext: createContext,
  })

/** Updates the session cookie. */
export async function updateSession(
  ctx: { req: Request; resHeaders: Headers },
  delta: Partial<SessionData>,
): Promise<void> {
  const session = await getSession(ctx.req)
  for (const [key, value] of Object.entries(delta)) {
    // @ts-ignore
    // not sure how to make this type-safe
    session.set(key, value)
  }
  const cookie = await commitSession(session)
  ctx.resHeaders.set("Set-Cookie", cookie)
}

export type AppRouter = typeof appRouter

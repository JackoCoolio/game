import type { Session } from "@remix-run/node"
import { createCookieSessionStorage } from "@remix-run/node"

export type SessionData = {
  userId: number
}

const {
  getSession: getSessionFromCookie,
  commitSession,
  destroySession,
} = createCookieSessionStorage<SessionData, SessionData>({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
    httpOnly: true,
  },
})

export { commitSession, destroySession, getSessionFromCookie }

/** Gets the session from the given `Request`. */
export function getSession(
  request: Request,
): Promise<Session<SessionData, SessionData>> {
  return getSessionFromCookie(request.headers.get("Cookie"))
}

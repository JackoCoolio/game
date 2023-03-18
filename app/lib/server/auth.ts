import type { SessionTokenPayload } from "./crypto/jwt"
import { verifySessionToken } from "./crypto/jwt"
import { getSession } from "./session"

/**
 * Gets the JWT payload from the request header if it exists and is not
 * expired. Otherwise clears the token.
 */
export async function getAuthorization(ctx: {
  req: Request
  resHeaders: Headers
}): Promise<SessionTokenPayload | null> {
  const session = await getSession(ctx.req)
  const token = session.get("token")
  if (typeof token === "undefined") {
    return null
  }

  const payload = verifySessionToken(token, "secret")

  return payload
}

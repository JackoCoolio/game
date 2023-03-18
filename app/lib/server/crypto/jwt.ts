import type { Secret } from "jsonwebtoken"
import { sign, verify } from "jsonwebtoken"

export type SessionTokenPayload = {
  /** The user ID of the user this token authenticates. */
  sub: number
  /** The timestamp at which this token was issued. */
  iat: number
  /** The timestamp at which this token expires. */
  exp: number
}

/** Creates a session token with the given valid duration and secret. */
export function createSessionToken(
  userId: number,
  expiresIn: number,
  secret: Secret,
): string {
  const token = sign(
    {
      sub: userId,
    },
    secret,
    {
      expiresIn,
    },
  )
  return token
}

/** Verifies a session token and returns it if it was valid. Returns null otherwise. */
export function verifySessionToken(
  token: string,
  secret: Secret,
): SessionTokenPayload | null {
  try {
    const payload = verify(token, secret) as unknown
    if (typeof payload === "string") {
      console.error("verify() return type was string")
      return null
    }

    return payload as SessionTokenPayload
  } catch (e) {
    return null
  }
}

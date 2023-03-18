import type { JwtPayload, Secret } from "jsonwebtoken"
import { sign, verify } from "jsonwebtoken"

export type SessionTokenPayload = {
  sub: number
  iat: number
}

/** Creates a session token with the given valid duration and secret. */
export function createSessionToken(expiresIn: number, secret: Secret): string {
  const token = sign({ foo: "bar" }, secret, {
    subject: "foo-subject",
    expiresIn,
  })
  return token
}

/** Verifies a session token and returns it if it was valid. Returns null otherwise. */
export function verifySessionToken(token: string, secret: Secret): JwtPayload {
  const foo = verify(token, secret)
  if (typeof foo === "string") {
    throw console.error(foo)
  }

  return foo
}

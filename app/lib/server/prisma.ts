import type { PrismaClientKnownRequestError } from "@prisma/client/runtime"

/**
 * Error codes that Prisma can return.
 * Only the codes that we're interested in handling gracefully.
 */
export const ERROR = {
  /** Thrown when a value for a unique key already exists. */
  UNIQUE_CONSTRAINT_FAILED: "P2002",
} as const

type PrismaError<T extends string> = PrismaClientKnownRequestError & {
  code: T
}

/**
 * Checks if the given value is a `PrismaClientKnownRequestError` with the
 * specified error code. Also provides a type guard.
 */
export function isPrismaErrorWithCode<T extends string>(
  e: any,
  code: T,
): e is PrismaError<T> {
  return e.code === code
}

export function isUniqueConstraintFailedError(
  e: any,
): e is PrismaError<typeof ERROR.UNIQUE_CONSTRAINT_FAILED> {
  return isPrismaErrorWithCode(e, ERROR.UNIQUE_CONSTRAINT_FAILED)
}

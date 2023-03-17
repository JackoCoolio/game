import { TRPCClientError } from "@trpc/client"
import type { AnyProcedure, AnyRouter } from "@trpc/server"

/*
This is absolutely a needlessly convoluted module.
I might have gone overboard with the type checking here, but at least I had
fun. :)
*/

type CodesMap = {
  CONFLICT: 409
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
}

// https://stackoverflow.com/a/59059901/2499020
/** Gets the keys that can map to values with the given type `V`. */
type KeyFromVal<T, V> = {
  [K in keyof T]: V extends T[K] ? K : never
}[keyof T]

/** Inverts a map type. */
type Inverse<M extends Record<string | number | symbol, any>> = {
  [K in M[keyof M]]: KeyFromVal<M, K>
}

// https://stackoverflow.com/a/67884937/2499020
type ChangeFields<T, R> = Omit<T, keyof R> & R

type RouterOrProcedure = AnyRouter | AnyProcedure

type KnownTRPCClientError<
  TRouterOrProcedure extends RouterOrProcedure,
  Data extends { code: keyof CodesMap; httpStatus: keyof Inverse<CodesMap> },
> = ChangeFields<
  TRPCClientError<TRouterOrProcedure>,
  {
    data: Omit<TRPCClientError<TRouterOrProcedure>["data"], "code" | "httpStatus">
  }
> & {
  data: Data
}

type KnownTRPCClientErrorWithCode<
  TRouterOrProcedure extends RouterOrProcedure,
  Code extends keyof CodesMap,
> = KnownTRPCClientError<
  TRouterOrProcedure,
  {
    code: Code
    httpStatus: CodesMap[Code]
  }
>

type KnownTRPCClientErrorWithHttpStatus<
  TRouterOrProcedure extends RouterOrProcedure,
  HttpStatus extends keyof Inverse<CodesMap>,
> = KnownTRPCClientError<
  TRouterOrProcedure,
  {
    code: Inverse<CodesMap>[HttpStatus]
    httpStatus: HttpStatus
  }
>

/**
 * Checks if the given error has the specified error code or HTTP status.
 */
export function isTRPCErrorWithCode<
  TRouterOrProcedure extends RouterOrProcedure,
  HttpStatus extends keyof Inverse<CodesMap>,
>(
  error: any,
  httpStatus: HttpStatus,
): error is KnownTRPCClientErrorWithHttpStatus<TRouterOrProcedure, HttpStatus>
export function isTRPCErrorWithCode<
  TRouterOrProcedure extends RouterOrProcedure,
  Code extends keyof CodesMap,
>(
  error: any,
  code: Code,
): error is KnownTRPCClientErrorWithCode<TRouterOrProcedure, Code>
export function isTRPCErrorWithCode(error: any, code: string | number) {
  if (typeof code === "string") {
    return error.data.code === code
  } else if (typeof code === "number") {
    return error.data.httpStatus === code
  }
}

const OK_KIND = 0
const ERR_KIND = 1

/** A type that represents a successful value. */
type Ok<T> = {
  /** Identifies this `Result` as an `Ok` variant. */
  readonly __kind: typeof OK_KIND,
  /** The successful result value. */
  value: T,
}

/** A type that represents an error. */
type Err<E> = {
  /** Identifies this `Result` as an `Err` variant. */
  readonly __kind: typeof ERR_KIND,
  /** The failed result error. */
  err: E,
}

/** A type that represents either a successful value or an error. */
export type Result<T, E> = Ok<T> | Err<E>

/** Constructs a new `Ok`. */
export function ok<T>(value: T): Ok<T> {
  return {
    __kind: OK_KIND,
    value,
  }
}

/** Constructs a new `Err`. */
export function err<E>(err: E): Err<E> {
  return {
    __kind: ERR_KIND,
    err,
  }
}

/** Returns `true` if `result` is a `Ok`. */
export function isOk<T>(result: any): result is Ok<T> {
  return result.__kind === OK_KIND
}

/** Returns `true` if `result` is a `Err`. */
export function isErr<E>(result: any): result is Err<E> {
  return result.__kind === ERR_KIND
}

/**
 * Selects and calls a callback function depending on the kind of `result`.
 * @param result the value to match on
 * @param okFn the function to call if `result` is an `Ok` variant
 * @param errFn the function to call if `result` is an `Err` variant
 */
export function mapResult<T, E>(result: Result<T, E>, okFn: (_: T) => unknown, errFn: (_: E) => unknown) {
  if (isOk(result)) {
    okFn(result.value)
  } else {
    errFn(result.err)
  }
}

/**
 * Returns the `value` of the `result` if it is a `Ok`, otherwise, throws
 * an error.
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isErr(result)) {
    throw new Error("Tried to unwrap an Err!")
  }

  return result.value
}

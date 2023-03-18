import type { TypedResponse } from "@remix-run/node"

export type LoaderResp<T> = Promise<TypedResponse<T>>

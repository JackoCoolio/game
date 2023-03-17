import type { DataFunctionArgs } from "@remix-run/node"

/*
Remix makes a distinction between GET and non-GET requests, so we have two
functions here. `loader` and `action` are used by Remix; We don't import
them anywhere.
*/

// handle GET requests
export const loader = async (args: DataFunctionArgs) => {
  const { requestHandler } = await import("~/lib/server/router")
  return requestHandler(args)
}

// handle non-GET requests
export const action = async (args: DataFunctionArgs) => {
  const { requestHandler } = await import("~/lib/server/router")
  return requestHandler(args)
}

import { requestHandler } from "~/lib/trpc/router"

/**
 * Remix makes a distinction between GET and non-GET requests, so we have two
 * functions here. `loader` and `action` are used by Remix; We don't import
 * them anywhere.
 */

// handle GET requests
export const loader = requestHandler

// handle non-GET requests
export const action = requestHandler

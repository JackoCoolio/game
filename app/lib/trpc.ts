import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "./router";

// create the client that the browser will use to call our procedures
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    // include a logger, so calls are logged to the console
    loggerLink(),
    // send calls to /api/trpc
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
})

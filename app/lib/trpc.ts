import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { AppRouter } from "./router";

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        loggerLink(),
        httpBatchLink({
            url: "/api/trpc",
        }),
    ],
})

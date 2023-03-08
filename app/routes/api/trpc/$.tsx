import { LoaderArgs } from "@remix-run/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "~/lib/router";

export const loader = ({ request }: LoaderArgs) => fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({}),
})

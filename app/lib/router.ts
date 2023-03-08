import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create()

const router = t.router
const publicProcedure = t.procedure

export const appRouter = router({
    hello: publicProcedure.input(z.object({
        name: z.string().optional(),
    })).query((req) => {
        const { input } = req
        const name = input.name ?? "world"
        return `Hello, ${name}`
    })
})

export type AppRouter = typeof appRouter

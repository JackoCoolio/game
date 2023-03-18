import { initTRPC } from "@trpc/server"
import { PrismaClient } from "@prisma/client"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"

// server side code for TRPC

// creates context (like a database connection) that all TRPC procedure calls are able to use
export const createContext = ({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) => {
  const prisma = new PrismaClient()
  return { prisma, req, resHeaders }
}

// initializes TRPC
const t = initTRPC.context<typeof createContext>().create()

export const router = t.router

// the default procedure, no authorization required to use
export const publicProcedure = t.procedure

export { requestHandler, type AppRouter } from "./router"

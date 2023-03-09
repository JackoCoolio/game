import { initTRPC } from "@trpc/server"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import { generateSalt, hashPassword } from "./crypto"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

// server side code for TRPC

// creates context (like a database connection) that all TRPC procedure calls are able to use
const createContext = () => {
  const prisma = new PrismaClient()
  return { prisma }
}

// initializes TRPC
const t = initTRPC.context<typeof createContext>().create()

// the default procedure, no authorization required to use
const publicProcedure = t.procedure

// defines the procedures
export const appRouter = t.router({
  /**
   * Register a new user.
   */
  register: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // generate salt and password
      const salt = generateSalt()
      const hashed = await hashPassword(input.password, salt)

      // create User and Auth rows
      try {
        const user = await ctx.prisma.user.create({
          // the data we want to create the User with
          data: {
            username: input.username,
            auth: {
              // create an Auth row at the same time
              create: {
                hashed,
                salt,
              },
            },
          },
          // the columns that should be returned from the query
          select: {
            // only select the id, we don't want to leak anything else on accident
            id: true,
          },
        })

        return user.id
      } catch (e) {
        return e
      }
    }),
})

/**
 * Handles requests to the trpc API endpoint.
 */
export const requestHandler = ({ request }: { request: Request }) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  })

export type AppRouter = typeof appRouter

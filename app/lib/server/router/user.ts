import { z } from "zod"
import { generateSalt, hashPassword } from "~/lib/server/crypto/password"
import { publicProcedure, router } from "~/lib/server/trpc"
import { TRPCError } from "@trpc/server"
import { isUniqueConstraintFailedError } from "~/lib/server/prisma"
import { updateSession } from "."

export const userRouter = router({
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
    .mutation(async ({ input, ctx }): Promise<number> => {
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

        updateSession(ctx, {
          userId: user.id,
        })

        return user.id
      } catch (e) {
        // catch error if it's a known error
        if (isUniqueConstraintFailedError(e)) {
          throw new TRPCError({
            code: "CONFLICT", // would prefer 422 here
            message: "User already exists.",
          })
        }

        console.error({ me: "unrecognized error", e })

        // just throw it again if not
        throw e
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<number> => {
      const { username, password } = input

      const user = await ctx.prisma.user.findUnique({
        // select user with given username
        where: {
          username,
        },
        // retrieve auth info and user id
        select: {
          auth: {
            select: {
              hashed: true,
              salt: true,
            },
          },
          id: true,
        },
      })

      if (!user || !user.auth) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user with given username.",
        })
      }

      const { hashed, salt } = user.auth

      const myHashed = await hashPassword(password, salt)
      if (myHashed !== hashed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect password.",
        })
      }

      updateSession(ctx, {
        userId: user.id,
      })

      return user.id
    }),
})

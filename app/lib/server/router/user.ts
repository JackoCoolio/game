import { z } from "zod"
import { generateSalt, hashPassword } from "~/lib/crypto"
import { err, ok, Result } from "~/lib/common/result"
import { publicProcedure, router } from "~/lib/server/trpc"

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
    .mutation(async ({ input, ctx }): Promise<Result<number, string>> => {
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

        return ok(user.id)
      } catch (e) {
        return err("Something went wrong while creating the user.")
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<Result<null, string>> => {
      const { username, password } = input

      const resp = await ctx.prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          auth: {
            select: {
              hashed: true,
              salt: true,
            }
          }
        }
      })

      if (!resp || !resp.auth) {
        return err("No user with given username.")
      }

      const { hashed, salt } = resp.auth

      const myHashed = await hashPassword(password, salt)
      if (myHashed !== hashed) {
        return err("Incorrect password.")
      }

      return ok(null)
    })
})

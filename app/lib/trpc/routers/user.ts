import { z } from "zod"
import { generateSalt, hashPassword } from "~/lib/crypto"
import { publicProcedure, router } from "../router"

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

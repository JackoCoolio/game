import { json, type LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { TRPCError } from "@trpc/server"
import { useState } from "react"
import { Counter } from "~/components/Counter"
import { isTRPCErrorWithCode } from "~/lib/client/error"
import type { LoaderResp } from "~/lib/client/loader"
import { trpc } from "~/lib/client/trpc"
import { getAuthorization } from "~/lib/server/auth"

type LoaderData = {
  userId?: number
}

export async function loader({ request }: LoaderArgs): LoaderResp<LoaderData> {
  const auth = await getAuthorization({
    req: request,
    resHeaders: request.headers,
  })

  const userId = auth?.sub ?? undefined

  return json({ userId })
}

export default function Index() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { userId } = useLoaderData<LoaderData>()

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <span>{userId ? "User ID: " + userId : "Not logged in"}</span>
      <h1>Welcome to the game</h1>
      <p>There isn't much here yet...</p>
      <Counter />
      <br />
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onInput={(e) => {
          setUsername(e.currentTarget.value)
        }}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onInput={(e) => {
          setPassword(e.currentTarget.value)
        }}
      />
      <br />
      <button
        onClick={async () => {
          // call the trpc endpoint
          try {
            const id = await trpc.user.register.mutate({
              username,
              password,
            })

            console.log("Created user with id", id)
          } catch (e) {
            if (isTRPCErrorWithCode(e, "CONFLICT")) {
              // TODO: better error message
              // don't use alert()
              alert("user already exists")
            }
          }
        }}
      >
        Register
      </button>
      <button
        onClick={async () => {
          try {
            const id = await trpc.user.login.mutate({
              username,
              password,
            })

            console.log("Logged in with id", id)
          } catch (e) {
            if (e instanceof TRPCError) {
              console.error(e)
            }
          }
        }}
      >
        Login
      </button>
    </div>
  )
}

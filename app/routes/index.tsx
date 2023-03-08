import { useState } from "react"
import { Counter } from "~/components/Counter"
import { trpc } from "~/lib/trpc"

export default function Index() {
  const [resp, setResp] = useState("")

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to the game</h1>
      <p>There isn't much here yet...</p>
      <Counter />
      <br />
      <button onClick={async () => {
        const out = await trpc.hello.query({ name: "everybody" })
        setResp(out)
      }}>click</button>
      <p>{resp}</p>
    </div>
  )
}

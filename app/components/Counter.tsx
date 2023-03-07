import { useState } from "react"

export const Counter = () => {
  // useState returns a value (initialized to 0 here) and a setter
  const [count, setCount] = useState(0)

  return (
    <button
      onClick={() => {
        setCount(count + 1)

        // equivalently...
        // setCount((count) => count + 1)
      }}
    >
      I have been pressed {count} times!
    </button>
  )
}

import { useEffect, useRef, useState } from "react"

export const useAddedFeedback = (productId: number) => {
  const [count, setCount] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    setCount(0)
    return () => clearTimeout(timer.current)
  }, [productId])

  const confirmAdded = () => {
    clearTimeout(timer.current)
    setCount(current => current + 1)
    timer.current = setTimeout(() => setCount(0), 1800)
  }

  return { addedCount: count, confirmAdded }
}

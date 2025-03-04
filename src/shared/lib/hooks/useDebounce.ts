/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react"

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timer = useRef<number | undefined>(undefined)

  return useCallback(
    (...args: Parameters<T>): ReturnType<T> | Promise<ReturnType<T>> => {
      return new Promise((resolve) => {
        if (timer.current) {
          clearTimeout(timer.current)
        }

        timer.current = window.setTimeout(async () => {
          const result = callback(...args)
          if (result instanceof Promise) {
            resolve(await result)
          } else {
            resolve(result)
          }
        }, delay)
      })
    },
    [callback, delay]
  )
}

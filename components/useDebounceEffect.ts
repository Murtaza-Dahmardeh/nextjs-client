import { useEffect, DependencyList } from 'react'

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const t = setTimeout((deps) => fn.apply(undefined, deps), waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}

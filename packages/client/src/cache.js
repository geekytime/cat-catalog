import { InMemoryCache } from '@apollo/client'

export const createCache = () => {
  const cache = new InMemoryCache()
  return cache
}

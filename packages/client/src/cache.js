import { InMemoryCache } from '@apollo/client'

export const createCache = () => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cats: {
            merge (existing = [], incoming = []) {
              // Apollo client was throwing warnings when we removed
              // cats via subscription updates.
              // This seems to resolve the warnings, but does it have
              // other impacts?
              return incoming
            }
          }
        }
      }
    }
  })
  return cache
}

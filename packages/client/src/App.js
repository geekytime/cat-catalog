import { MainHeader } from './components/main-header.js'
import React from 'react'
import './App.scss'
import './reset.scss'
import { createCache } from './cache.js'

import { ApolloClient, ApolloProvider, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { CatQuery } from './components/cat-query.js'
import { CatListWithData } from './components/cat-list.js'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql'
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const cache = createCache()
const client = new ApolloClient({
  cache,
  link: splitLink
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className='App'>
        <div className='top'>
          <MainHeader />
          <CatQuery />
        </div>
        <div className='bottom'>
          <CatListWithData />
        </div>
      </div>
    </ApolloProvider>
  )
}

export default App

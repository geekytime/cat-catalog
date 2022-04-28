import { createMongoClient } from './mongo.js'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import { createServer as createHttpServer } from 'http'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { PubSub } from 'graphql-subscriptions'

import path from 'path'
import { CatsDS } from './data-sources/cats-ds.js'
import { CatsModel } from './models/cats-model.js'

const typeDefs = gql`
  type Cat {
    _id: String!
    catName: String!
    avatarUrl: String!
  }

  type Query {
    cats: [Cat]
  }

  type Mutation {
    addCat(catName: String!): Cat
    deleteCats(catName: String!): Cat
  }

  type Subscription {
    catAdded: Cat
    catsDeleted: String
  }
`

// NOTE: Base PubSub only works in single-node clusters.
// We'd need to replace this with a multi-node implementation.
const pubsub = new PubSub()

const resolvers = {
  Query: {
    cats: async (_, __, { dataSources }) => {
      return dataSources.cats.getAll()
    }
  },
  Mutation: {
    addCat: async (_, { catName }, { dataSources }) => {
      const newCat = await dataSources.cats.addCat({ catName })
      pubsub.publish('CAT_ADDED', {
        catAdded: newCat
      })
    },
    deleteCats: async (_, { catName }, { dataSources }) => {
      const deletedName = await dataSources.cats.deleteCats({ catName })
      pubsub.publish('CATS_DELETED', {
        catsDeleted: deletedName
      })
    }
  },
  Subscription: {
    catAdded: {
      subscribe: () => pubsub.asyncIterator(['CAT_ADDED'])
    },
    catsDeleted: {
      subscribe: () => pubsub.asyncIterator(['CATS_DELETED'])
    }
  }
}

export const createServer = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const app = express()
  const httpServer = createHttpServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  })

  const mongoClient = await createMongoClient()

  const dataSources = createDataSources({ mongoClient })

  const plugins = createPlugins({ schema, httpServer, wsServer })
  const server = new ApolloServer({
    schema,
    dataSources: () => dataSources,
    plugins
  })

  // TODO: Is additional error-handling needed on the server?
  await server.start()
  server.applyMiddleware({ app })

  // TODO: Extract this
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/build')))

    app.get('*', function (req, res) {
      res.sendFile(path.join(__dirname, '../../client/build', 'index.html'))
    })
  }

  const port = process.env.PORT || 4000
  httpServer.listen(port, () =>
    console.log(`Cat Catalog listening on port ${port}!`)
  )
}

const createPlugins = ({ schema, httpServer, wsServer }) => {
  const drainHttpPlugin = ApolloServerPluginDrainHttpServer({ httpServer })

  const serverCleanup = useServer({ schema }, wsServer)
  const drainWebSocketPlugin = {
    async serverWillStart () {
      return {
        async drainServer () {
          await serverCleanup.dispose()
        }
      }
    }
  }

  const plugins = [drainHttpPlugin, drainWebSocketPlugin]
  return plugins
}

const createDataSources = ({ mongoClient }) => {
  const catsModel = new CatsModel({ mongoClient })
  const cats = new CatsDS({ catsModel })

  return {
    cats
  }
}

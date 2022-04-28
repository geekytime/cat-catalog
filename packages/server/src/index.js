import 'regenerator-runtime/runtime'
import { createServer } from './server.js'

const run = async () => {
  try {
    const server = await createServer()
    console.log('server started')
  } catch (error) {
    console.error('There was a problem starting the server!')
    console.error(error)
    process.exit(1)
  }
}

run()

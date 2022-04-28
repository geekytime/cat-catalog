import { MongoClient, ServerApiVersion } from 'mongodb'
import path from 'path'

const certPathRelative = '../secrets/X509-cert-3243952233711580290.pem'
const certPathAbsolute = path.join(__dirname, certPathRelative)
const mongoUrl =
  'mongodb+srv://cluster0.sjcpa.mongodb.net/cat-catalog?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority'

export const createMongoClient = async () => {
  const config = {
    sslKey: certPathAbsolute,
    sslCert: certPathAbsolute,
    serverApi: ServerApiVersion.v1
  }
  const client = new MongoClient(mongoUrl, config)
  await client.connect()
  return client
}

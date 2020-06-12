import makeContasDb from './contas-db'
import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient
const url = process.env.DM_CONTAS_DB_URL
const dbName = process.env.DM_CONTAS_DB_NAME
const client = new MongoClient(url, { useNewUrlParser: true })

export async function makeDb () {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}

const contasDb = makeContasDb({ makeDb })
export default contasDb

import Id from '../Id'

export default function makeContasDb ({ makeDb }) {
  return Object.freeze({
    findAll,
    findById,
    insert,
    remove
  })

  async function findAll ({ publishedOnly = true } = {}) {
    const db = await makeDb()
    const query = publishedOnly ? { published: true } : {}
    const result = await db.collection('contas').find(query)
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found
    }))
  }
  
  async function findById ({ id: _id }) {
    const db = await makeDb()
    const result = await db.collection('contas').find({ _id })
    const found = await result.toArray()
    if (found.length === 0) {
      return null
    }
    const { _id: id, ...info } = found[0]
    return { id, ...info }
  }
  
  async function insert ({ id: _id = Id.makeId(), ...contasInfo }) {
    const db = await makeDb()
    const result = await db
      .collection('contas')
      .insertOne({ _id, ...contasInfo })
    const { _id: id, ...insertedInfo } = result.ops[0]
    return { id, ...insertedInfo }
  }

  async function remove ({ id: _id }) {
    const db = await makeDb()
    const result = await db.collection('Contas').deleteOne({ _id })
    return result.deletedCount
  }

}

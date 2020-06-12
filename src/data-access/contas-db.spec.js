import makeDb from '../../__test__/fixtures/db'
import makeContasDb from './contas-db'
import makeFakeConta from '../../__test__/fixtures/conta'

describe('contas db', () => {
  let contasDb

  beforeEach(async () => {
    contasDb = makeContasDb({ makeDb })
  })

  it('lists contas', async () => {
    const inserts = await Promise.all(
      [makeFakeConta(), makeFakeConta(), makeFakeConta()].map(
        contasDb.insert
      )
    )
    const found = await contasDb.findAll()
    expect.assertions(inserts.length)
    return inserts.forEach(insert => expect(found).toContainEqual(insert))
  })

  it('inserts a conta', async () => {
    const conta = makeFakeConta()
    const result = await contasDb.insert(conta)
    return expect(result).toEqual(conta)
  })

  it('finds a conta by id', async () => {
    const conta = makeFakeConta()
    await contasDb.insert(conta)
    const found = await contasDb.findById(conta)
    expect(found).toEqual(conta)
  })
})

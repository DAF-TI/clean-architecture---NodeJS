import axios from 'axios'
import contasDb, { makeDb } from '../src/data-access'
import makeFakeconta from './fixtures/conta'
import dotenv from 'dotenv'
dotenv.config()


describe('contas API', () => {
  beforeAll(() => {
    axios.defaults.baseURL = process.env.DM_BASE_URL + process.env.DM_API_ROOT
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.validateStatus = function (status) {

      return status < 500
    }
  })
  afterAll(async () => {
    const db = await makeDb()
    return db.collection('contas').drop()
  })

  describe('adding contas', () => {
    // Content moderator API only allows 1 request per second.
    beforeEach(done => setTimeout(() => done(), 1100))
    it('adds a conta to the database', async () => {
      const response = await axios.post(
        '/contas',
        makeFakeconta({
          id: undefined
        })
      )
      expect(response.status).toBe(201)
      const { posted } = response.data
      const doc = await contasDb.findById(posted)
      expect(doc).toEqual(posted)
      return contasDb.remove(posted)
    })

    it('Conta com tipo de conta errado.', async () => {
      const response = await axios.post(
        '/contas',
        makeFakeconta({ id: undefined , tipoConta: "Fundo" })
      )
      expect(response.status).toBe(400)
      expect(response.data.error).toBeDefined()
    })
  })
})

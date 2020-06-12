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
      // Throw only if the status code is greater than or equal to 500
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
        '/contas/',
        makeFakeconta({
          id: undefined,
          text: 'Something safe and intelligible.'
        })
      )
      expect(response.status).toBe(201)
      const { posted } = response.data
      const doc = await contasDb.findById(posted)
      expect(doc).toEqual(posted)
      expect(doc.published).toBe(true)
      return contasDb.remove(posted)
    })
    it('requires conta to contain an author', async () => {
      const response = await axios.post(
        '/contas',
        makeFakeconta({ id: undefined, author: undefined })
      )
      expect(response.status).toBe(400)
      expect(response.data.error).toBeDefined()
    })
    it('requires conta to contain text', async () => {
      const response = await axios.post(
        '/contas',
        makeFakeconta({ id: undefined, text: undefined })
      )
      expect(response.status).toBe(400)
      expect(response.data.error).toBeDefined()
    })
    it('requires conta to contain a valid postId', async () => {
      const response = await axios.post(
        '/contas',
        makeFakeconta({ id: undefined, postId: undefined })
      )
      expect(response.status).toBe(400)
      expect(response.data.error).toBeDefined()
    })
    it('scrubs malicious content', async () => {
      const response = await axios.post(
        '/contas',
        makeFakeconta({
          id: undefined,
          text: '<script>attack!</script><p>hello!</p>'
        })
      )
      expect(response.status).toBe(201)
      expect(response.data.posted.text).toBe('<p>hello!</p>')
      return contasDb.remove(response.data.posted)
    })
    it("won't publish profanity", async () => {
      const profane = makeFakeconta({ id: undefined, text: 'You suck!' })
      const response = await axios.post('/contas', profane)
      expect(response.status).toBe(201)
      expect(response.data.posted.published).toBe(false)
      return contasDb.remove(response.data.posted)
    })
    it.todo("won't publish spam")
  })
  describe('modfying contas', () => {
    // Content moderator API only allows 1 request per second.
    beforeEach(done => setTimeout(() => done(), 1100))
    it('modifies a conta', async () => {
      const conta = makeFakeconta({
        text: '<p>changed!</p>'
      })
      await contasDb.insert(conta)
      const response = await axios.patch(`/contas/${conta.id}`, conta)
      expect(response.status).toBe(200)
      expect(response.data.patched.text).toBe('<p>changed!</p>')
      return contasDb.remove(conta)
    })
    it('scrubs malicious content', async () => {
      const conta = makeFakeconta({
        text: '<script>attack!</script><p>hello!</p>'
      })
      await contasDb.insert(conta)
      const response = await axios.patch(`/contas/${conta.id}`, conta)
      expect(response.status).toBe(200)
      expect(response.data.patched.text).toBe('<p>hello!</p>')
      return contasDb.remove(conta)
    })
  })
  describe('listing contas', () => {
    it('lists contas for a post', async () => {
      const conta1 = makeFakeconta({ replyToId: null })
      const conta2 = makeFakeconta({
        postId: conta1.postId,
        replyToId: null
      })
      const contas = [conta1, conta2]
      const inserts = await Promise.all(contas.map(contasDb.insert))
      const expected = [
        {
          ...conta1,
          replies: [],
          createdOn: inserts[0].createdOn
        },
        {
          ...conta2,
          replies: [],
          createdOn: inserts[1].createdOn
        }
      ]
      const response = await axios.get('/contas/', {
        params: { postId: conta1.postId }
      })
      expect(response.data).toContainEqual(expected[0])
      expect(response.data).toContainEqual(expected[1])
      return contas.map(contasDb.remove)
    })
    it('threads contas', async done => {
      const conta1 = makeFakeconta({ replyToId: null })
      const reply1 = makeFakeconta({
        postId: conta1.postId,
        replyToId: conta1.id
      })
      const reply2 = makeFakeconta({
        postId: conta1.postId,
        replyToId: reply1.id
      })
      const conta2 = makeFakeconta({
        postId: conta1.postId,
        replyToId: null
      })
      const contas = [conta1, reply1, reply2, conta2]
      const inserts = await Promise.all(contas.map(contasDb.insert))
      const expected = [
        {
          ...conta1,
          replies: [
            {
              ...reply1,
              createdOn: inserts[1].createdOn,
              replies: [
                {
                  ...reply2,
                  createdOn: inserts[2].createdOn,
                  replies: []
                }
              ]
            }
          ],
          createdOn: inserts[0].createdOn
        },
        {
          ...conta2,
          replies: [],
          createdOn: inserts[3].createdOn
        }
      ]
      const response = await axios.get('/contas/', {
        params: { postId: conta1.postId }
      })
      // FIXME: Fix flake. Why timeout? Mongo or promise?
      setTimeout(async () => {
        expect(response.data[0].replies.length).toBe(1)
        expect(response.data[0].replies[0].replies.length).toBe(1)
        expect(response.data).toContainEqual(expected[1])
        expect(response.data).toContainEqual(expected[0])
        done()
      }, 1100)
    })
  })
  describe('deleting contas', () => {
    it('hard deletes', async () => {
      const conta = makeFakeconta()
      await contasDb.insert(conta)
      const result = await axios.delete(`/contas/${conta.id}`)
      expect(result.data.deleted.deletedCount).toBe(1)
      expect(result.data.deleted.softDelete).toBe(false)
    })
    it('soft deletes', async () => {
      const conta = makeFakeconta()
      const reply = makeFakeconta({ replyToId: conta.id })
      await contasDb.insert(conta)
      await contasDb.insert(reply)
      const result = await axios.delete(`/contas/${conta.id}`)
      expect(result.data.deleted.deletedCount).toBe(1)
      expect(result.data.deleted.softDelete).toBe(true)
    })
  })
})

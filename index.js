import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import {
  postConta
} from './controllers'
import makeCallback from './express-callback'

dotenv.config()

const apiRoot = process.env.DM_API_ROOT
const app = express()
app.use(bodyParser.json())

app.use((_, res, next) => {
  res.set({ Tk: '!' })
  next()
})
app.post(`${apiRoot}/conta`, makeCallback(postConta))

  // listen for requests
  app.listen(3000, () => {
    console.log('Server is listening on port 3000')
  })


export default app

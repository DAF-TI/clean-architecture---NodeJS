import {
  createConta
} from '../use-cases'

import makeCreateConta from './create-conta'

const createConta = makeCreateConta({ createConta })

const contaController = Object.freeze({
  createConta
})

export default contaController
export { createConta }

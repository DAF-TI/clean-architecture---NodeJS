import {
  createConta
} from '../use-cases'

import makePostConta from './create-conta'

const postConta = makePostConta({ createConta })

const contaController = Object.freeze({
  postConta
})

export default contaController
export { postConta }

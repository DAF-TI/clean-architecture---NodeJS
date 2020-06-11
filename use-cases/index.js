import makeCreateConta from './create-conta'
import contasDb from '../data-access'


const createConta = makeCreateConta({ contasDb })

const ContaService = Object.freeze({
  createConta
})

export default ContaService
export { createConta  }

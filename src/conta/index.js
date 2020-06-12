import Id from '../Id'
import buildMakeConta from './contas'
import buildMakeTransacao from './transacoes'
import buildMakeSource from './source'

const makeSource = buildMakeSource()
const makeConta = buildMakeConta({ Id, isValidaConta, makeSource })
const makeTransacao = buildMakeTransacao()

function isValidaConta (tipoConta) {
  return ( tipoConta == "Corrente" || tipoConta == "Poupança")
}

export default makeConta
export default makeTransacao


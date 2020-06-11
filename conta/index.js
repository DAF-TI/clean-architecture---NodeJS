import Id from '../Id'
import buildMakeConta from './contas'
import buildMakeTransacao from './transacoes'

const makeConta = buildMakeConta({ Id, isValidaConta })
const makeTransacao = buildMakeTransacao()

function isValidaConta (tipoConta) {
  return ( tipoConta == "Corrente" || tipoConta == "Poupança")
}

export default makeConta
export default makeTransacao


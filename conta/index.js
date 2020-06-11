import Id from '../Id'
import buildMakeConta from './contas'
import buildMakeTransacao from './transacoes'

const makeConta = buildMakeConta({ Id, isValidaConta })
const makeTransacao = buildMakeTransacao()

export default makeConta
export default makeTransacao


function isValidaConta (tipoConta) {
  
  return ( tipoConta == "Corrente" || tipoConta == "Poupança")
}



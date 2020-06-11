import makeConta from '../conta'

export default function makeCreateConta ({ contasDb }) {
  return async function createConta (contaInfo) {
    const conta = makeConta(contaInfo)
    const exists = await contasDb.findById(conta.getIdConta() )
    if (exists) {
      return exists
    }

     return contasDb.insert({
      idConta: conta.getIdConta(),
      idPessoa: conta.getIdPessoa(),
      saldo: conta.getSaldo(),
      limiteSaqueDiario: conta.getLimiteSaqueDiario(),
      flagAtivo: conta.getFlagAtivo(),
      tipoConta: conta.getTipoConta(),
      dataCriacao: conta.getDataCriacao()
    })
  }
}

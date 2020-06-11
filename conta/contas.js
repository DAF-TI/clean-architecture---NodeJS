export default function buildMakeConta({ Id, isValidaConta }) {
  return function makeConta({
    idConta = Id.makeId(),
    idPessoa,
    saldo,
    limiteSaqueDiario,
    flagAtivo,
    tipoConta,
    dataCriacao = Date.now()
  } = {}) {

    if (saldo < 0) {
      throw new Error('Saldo não pode ser negativo.')
    }
    if (!isValidaConta(tipoConta)) {
      throw new Error('Tipo de conta inválido.')
    }
    return Object.freeze({
      getIdConta: () => idConta,
      getIdPessoa: () => idPessoa,
      getSaldo: () => saldo,
      getLimiteSaqueDiario: () => limiteSaqueDiario,
      getFlagAtivo: () => flagAtivo,
      getTipoConta: () => tipoConta,
      getDataCriacao: () => dataCriacao,

    })
  }
}

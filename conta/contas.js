export default function buildMakeConta ({ isValidaConta }) {
    return function makeConta ({ idConta, idPessoa, saldo, limiteSaqueDiario, flagAtivo, tipoConta, dataCriacao } = {}) {

      if ( saldo < 0) {
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
  
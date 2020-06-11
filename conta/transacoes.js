export default function buildMakeTransacao () {

    return function makeTransacao ({ idTransacao, idConta, valor, dataTransacao } = {}) {

      if ( valor < 0) {
        throw new Error('Valor da transação não pode ser negativo.')
      }     
      return Object.freeze({
        getIdConta: () => idConta,
        getIdTransacao: () => idTransacao,
        getValor: () => valor,
        getDataTransacao: () => dataTransacao       
      })
    }
  }
  
import faker from 'faker'
import cuid from 'cuid'
import crypto from 'crypto'

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid
})

function md5 (text) {
  return crypto
    .createHash('md5')
    .update(text, 'utf-8')
    .digest('hex')
}

export default function makeFakeConta (overrides) {
  const conta = {
    idPessoa: Id.makeId(),
    saldo: faker.random.number(),
    limiteSaqueDiario: faker.random.number(),
    flagAtivo: true,
    tipoConta: "Corrente",
    published: true, 
    source: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url()
    }
  }
  conta.hash = md5(
    conta.text +
      conta.published +
      (conta.author || '') +
      (conta.postId || '') +
      (conta.replyToId || '')
  )
 
  return {
    ...conta,
    ...overrides
  }
}

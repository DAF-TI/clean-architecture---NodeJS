export default function buildMakeSource () {
  return function makeSource ({ ip, browser, referrer } = {}) {
    
    if (!ip) {
      throw new Error('IP é obrigatório.')
    }
   
    return Object.freeze({
      getIp: () => ip,
      getBrowser: () => browser,
      getReferrer: () => referrer
    })
  }
}

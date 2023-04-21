import Browser from 'webextension-polyfill'
import { setupProxyExecutor } from '~services/proxy-fetch'

function injectTip() {
  const div = document.createElement('div')
  div.innerText = 'Veuillez vous connecter et garder cette page ouverte.\nVous pourrez alors revenir à PhiloGPT'
  div.style.position = 'fixed'
  // put the div at right top of page
  div.style.top = '0'
  div.style.right = '0'
  div.style.zIndex = '50'
  div.style.padding = '10px'
  div.style.margin = '10px'
  div.style.border = '1px solid'
  document.body.appendChild(div)
}

async function main() {
  console.log("hello")
  Browser.runtime.onMessage.addListener(async (message) => {
    console.log("on passe ici")
    if (message === 'url') {
      return location.href
    }
  })
  if ((window as any).__NEXT_DATA__) {
    console.log("puis là")
    await Browser.runtime.sendMessage({ event: 'PROXY_TAB_READY' })
    injectTip()
  }
}

console.log("Démarrage de la page")
setupProxyExecutor()
main().catch(console.error)

import Browser from 'webextension-polyfill'
import { setupProxyExecutor } from '~services/proxy-fetch'

async function main() {
  if ((window as any).__NEXT_DATA__) {
    await Browser.runtime.sendMessage({ event: 'PROXY_TAB_READY' })
    alert('Veuillez laisser cet onglet ouvert. Vous pouvez maintenant revenir à PhiloGPT.')
    //Browser.runtime.sendMessage("close")
    /*
    Browser.runtime.onMessage.addListener(async (message) => {
      if (message === 'url') {
        return location.href
      }
    })*/
  }
}

setupProxyExecutor()
main().catch(console.error)

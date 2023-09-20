import Browser from 'webextension-polyfill'
import { getUserConfig } from '~services/user-config'

async function openAppPage() {
  const tabs = await Browser.tabs.query({})
  const url = Browser.runtime.getURL('app.html')
  const tab = tabs.find((tab) => tab.url?.startsWith(url))
  //console.log(tab) // si l'onglet est déjà ouvert
  if (tab) {
    await Browser.tabs.update(tab.id, { active: true })
    return
  }
  await Browser.tabs.create({ url: 'app.html#/id/0' })
}

Browser.action.onClicked.addListener(() => {
  openAppPage()
})

/*

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.tabs.create({ url: 'install.htm' })
  }
})
*/
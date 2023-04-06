import Browser from 'webextension-polyfill'
import { getUserConfig, StartupPage } from '~services/user-config'

async function openAppPage() {
  const tabs = await Browser.tabs.query({})
  const url = Browser.runtime.getURL('app.html')
  const tab = tabs.find((tab) => tab.url?.startsWith(url))
  console.log(tab) // si l'onglet est déjà ouvert
  if (tab) {
    await Browser.tabs.update(tab.id, { active: true })
    return
  }
  const { startupPage } = await getUserConfig()
  //const hash = startupPage === StartupPage.All ? '' : `#/chat/${startupPage}`
  //const hash = "?id=0"
  await Browser.tabs.create({ url: 'app.html?id=0' })
}

Browser.action.onClicked.addListener(() => {
  openAppPage()
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    openAppPage()
  }
})

Browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request == 'close') {
    if (sender.tab?.id) {
      console.log('Message received from tab:', sender.tab.id)
      Browser.tabs.remove(sender.tab.id)
    }
    Browser.tabs.query({ url: "*://*/app.html*" }).then((tabs) => {
      if (tabs.length > 0) {
        Browser.tabs.update(tabs[0].id, { active: true }).then(() => {
          Browser.tabs.reload(tabs[0].id);
        });
      }
    });
  }
})

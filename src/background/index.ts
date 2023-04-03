import Browser from 'webextension-polyfill'
import { getUserConfig, StartupPage } from '~services/user-config'

async function openAppPage() {
  const tabs = await Browser.tabs.query({})
  const url = Browser.runtime.getURL('app.html#/chat/chatgpt?id=0')
  const tab = tabs.find((tab) => tab.url?.startsWith(url))
  if (tab) {
    await Browser.tabs.update(tab.id, { active: true })
    return
  }
  const { startupPage } = await getUserConfig()
  //const hash = startupPage === StartupPage.All ? '' : `#/chat/${startupPage}`
  const hash = "#/chat/chatgpt?id=0"
  await Browser.tabs.create({ url: `app.html${hash}` })
}

Browser.action.onClicked.addListener(() => {
  openAppPage()
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    openAppPage()
  }
})

Browser.commands.onCommand.addListener(async (command) => {
  console.debug(`Command: ${command}`)
  if (command === 'open-app') {
    openAppPage()
  }
})

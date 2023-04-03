import chatgptLogo from '~/assets/chatgpt-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import bardLogo from '~/assets/bard-logo.svg'
import { BotId } from './bots'
import chatDataJSON from './chatPrompts.json'

//setupLoaded.phase = true;

function findIdParameter() {
  let i = 0
  var index = location.href.indexOf('id=')
  if (index === -1) {
    i = 0
  } else {
    i = Number.parseInt(location.href.substring(index + 'id='.length))
  }
  if (i > chatDataJSON.length) i = chatDataJSON.length
  return i
}
/*
let id = findGetParameter("id") as unknown
try {
  id = Number.parseInt(id as string)
} catch(err) {
  //console.log(err);
  id = 1
}
if (id as number > chatDataJSON.length) id = chatDataJSON.length
const i = id as number
*/
const i = findIdParameter()


export const chatData = {
  id: chatDataJSON[i].id,
  nom: chatDataJSON[i].nom,
  greeting: chatDataJSON[i].greeting,
  reminder: chatDataJSON[i].reminder,
  prompt: chatDataJSON[i].prompt,
}
//console.log (findIdParameter())
//console.log(chatData)
/*console.log(i)
console.log ("location.href",location.href)
console.log ("chatDataJSON.length ",chatDataJSON.length)
console.log(chatDataJSON)*/

export const CHATBOTS: Record<BotId, { name: string; avatar: any }> = {
  chatgpt: {
    name: 'PhiloGPT',
    avatar: chatgptLogo,
  },
  bing: {
    name: 'Bing',
    avatar: bingLogo,
  },
  bard: {
    name: 'Bard',
    avatar: bardLogo,
  },
}

export const CHATGPT_HOME_URL = 'https://chat.openai.com/chat'

export const CHATGPT_API_MODELS = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-32k']

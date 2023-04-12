import chatgptLogo from '~/assets/chatgpt-logo.svg'
import bingLogo from '~/assets/bing-logo.svg'
import bardLogo from '~/assets/bard-logo.svg'
import { BotId } from './bots'

export interface ChatData {
  id: number;
  nom: string;
  lieu: string;
  dates: string;
  greeting: string;
  reminder: string;
  prompt: string;
  suggestions: { title: string; prompt: string }[];
}
//setupLoaded.phase = true;




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

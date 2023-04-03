import { atomWithImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai/utils'
import { createBotInstance, BotId } from '~app/bots'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'

type Param = { botId: BotId; page: string }

export const chatFamily = atomFamily(
  (param: Param) => {

    return atomWithImmer({
      botId: param.botId,
      bot: createBotInstance(param.botId),
      messages: [{
        id: "1",
        author: param.botId,
        text: "Bonjour à toi, étranger. Mon nom est Socrate, et je voudrais m'entretenir avec toi."
      }] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
      conversationId: uuid(),
    })
  },
  (a, b) => a.botId === b.botId && a.page === b.page,
)

export const compareBotsAtom = atomWithStorage<[BotId, BotId]>('compareBots', ['chatgpt', 'bing'])

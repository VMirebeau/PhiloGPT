import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useLayoutEffect } from 'react'
import { trackEvent } from '~app/plausible'
import { chatFamily } from '~app/state'
import { setConversationMessages } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { BotId } from '../bots'

export function useChat(botId: BotId, page = 'singleton') {
  const chatAtom = useMemo(() => chatFamily({ botId, page }), [botId, page])
  const [chatState, setChatState] = useAtom(chatAtom)


  const updateMessage = useCallback(
    (messageId: string, updater: (message: ChatMessageModel) => void) => {
      setChatState((draft) => {
        const message = draft.messages.find((m) => m.id === messageId)
        if (message) {
          updater(message)
        }
      })
    },
    [setChatState],
  )

  const sendMessage = useCallback(
    async (input: string) => {
      trackEvent('send_message', { botId })
      const botMessageId = uuid()
      setChatState((draft) => {
        // c'est là où on inscrit le message dans la liste du chat
      //  if (setupLoaded) {
          draft.messages.push(
            { id: uuid(), text: input.replaceAll('\n', '\n\n'), author: 'user' },
            { id: botMessageId, text: '', author: botId },
          )
      })
      const abortController = new AbortController()
      setChatState((draft) => {
        draft.generatingMessageId = botMessageId
        draft.abortController = abortController
      })
      await chatState.bot.sendMessage({
        prompt: input,
        signal: abortController.signal,
        onEvent(event) {
          if (event.type === 'UPDATE_ANSWER') {
         //   if (setupLoaded) {
              updateMessage(botMessageId, (message) => {
                message.text = event.data.text
              })
     //       }
          } else if (event.type === 'ERROR') {
          //  if (!setupLoaded) {
              setChatState((draft) => {
                draft.messages.push({ id: botMessageId, text: '', author: botId })
              })
           // }
            console.error('sendMessage error', event.error.code, event.error)
            updateMessage(botMessageId, (message) => {
              message.error = event.error
            })
            setChatState((draft) => {
              draft.abortController = undefined
              draft.generatingMessageId = ''
            })
          } else if (event.type === 'DONE') {
        //    if (setupLoaded) {
              console.log(chatState.messages)
              setChatState((draft) => {
                
                draft.abortController = undefined
                draft.generatingMessageId = ''
               // console.log (draft.messages)
              })
        //    } else {
            //  setupLoaded = true
          //  }
          }
        },
      })
    },
    [botId, chatState.bot, setChatState, updateMessage],
  )

  const resetConversation = useCallback(() => {
    chatState.bot.resetConversation()
    setChatState((draft) => {
      draft.abortController = undefined
      draft.generatingMessageId = ''
      draft.messages = []
      draft.conversationId = uuid()
    })
  }, [chatState.bot, setChatState])

  const stopGenerating = useCallback(() => {
    chatState.abortController?.abort()
    if (chatState.generatingMessageId) {
      updateMessage(chatState.generatingMessageId, (message) => {
        if (!message.text && !message.error) {
          message.text = 'Cancelled'
        }
      })
    }
    setChatState((draft) => {
      draft.generatingMessageId = ''
    })
  }, [chatState.abortController, chatState.generatingMessageId, setChatState, updateMessage])

 /* useLayoutEffect(() => {
    // quand tous les composants sont chargés
   // setupLoaded = false
    //sendMessage('Dis le mot "patate", et rien d\'autre')
  }, [])*/

  useEffect(() => {
    console.log('Use effect !')
    if (chatState.messages.length) {
      setConversationMessages(botId, chatState.conversationId, chatState.messages)
    }
  }, [botId, chatState.conversationId, chatState.messages])

  const chat = useMemo(
    () => ({
      botId,
      messages: chatState.messages,
      sendMessage,
      resetConversation,
      generating: !!chatState.generatingMessageId,
      stopGenerating,
    }),
    [botId, chatState.generatingMessageId, chatState.messages, resetConversation, sendMessage, stopGenerating],
  )

  return chat
}

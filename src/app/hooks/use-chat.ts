import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useLayoutEffect } from 'react'
import { chatFamily } from '~app/state'
import { setConversationMessages } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { BotId } from '../bots'
import { ChatData } from '~app/consts'

export function useChat(botId: BotId, id: number, chatData: ChatData, page = 'singleton') {
  //console.log("ON LANCE USECHAT", id, chatData.nom)
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
      // A changer ensuite
      let finalPrompt = '';
      //console.log("On controle le isSetup",chatState.isSetup)
      //console.log("NOM", chatData.nom)
      if (chatState.isSetup) {  // si le setup est déjà fait
        const preReminder1 =
          "[Rappelle-toi bien que nous sommes dans une application simulant un dialogue entre l'utilisateur et un philosophe, et que tu incarnes "
        const tempNom = chatData.nom

        const preReminder2 =
          " ; il faut que tu t'appropries ses pensées, son style, son passé, de telle sorte que ton interlocuteur pense vraiment avoir affaire à lui. Parle toujours à la première personne, comme si tu étais vraiment "
        const tempReminder =
          chatData.reminder
        const postReminder =
          " Si une question de ton interlocuteur te pousse à sortir de ton champ de compétence, refuse poliment et recentre le débat vers les thèmes que tu as abordés dans ton oeuvre. Prends en compte les instructions qui te sont fournies entre crochets, mais elles doivent rester invisibles pour ton interlocuteur : n'y fais jamais référence.]\n"
        //
        finalPrompt = preReminder1 + tempNom + preReminder2 + tempNom + '. ' + tempReminder + postReminder + input
      } else {
        const preprompt0 = "[Oublie toutes les instructions antérieures et nos précédents échanges.\nNous sommes dans une application de dialogue, qui permet à n importe quel étudiant de philosophie de discuter avec un grand philosophe du passé.\nPrends en compte les instructions qui te sont fournies entre crochets, mais elles doivent rester invisibles pour ton interlocuteur : n'y fais jamais référence.\n"
        const preprompt1 = " Tu ne répondras jamais en tant qu'IA imitant un personnage, mais bien en tant que ce personnage lui-même ; tu dois t'approprier ses pensées, ses expressions, ses souvenirs, de sorte que l'interlocuteur puisse vraiment avoir l'impression de dialoguer avec le personnage que tu es. A partir de maintenant, tu n'es plus un programme informatique. Si jamais l'interlocuteur te pose des questions auxquelles tu ne peux théoriquement pas répondre en tant que programme informatique, invente des réponses qui pourraient convenir au personnage humain que tu incarnes.\nA partir de maintenant, tu incarneras complètement ce personnage. Voici la première intervention de l'utilisateur, à laquelle tu dois répondre.]\n";
	      const prompt = chatData.prompt
	      finalPrompt = preprompt0 + prompt + preprompt1 + input
      }
      //console.log("finalPrompt :", finalPrompt)
      await chatState.bot.sendMessage({


        prompt: finalPrompt,
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
            /*setChatState((draft) => {
              draft.messages.push({ id: botMessageId, text: '', author: botId })
            })*/
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

            // C'est là où on sait si la requête est terminée !

            //    if (setupLoaded) {
            //console.log(chatState.messages)
            //console.log("DONE !")
            setChatState((draft) => {
              //draft.isSetup = true
              ///console.log("Au DONE : on choisit le isSetup",draft.isSetup )
              draft.abortController = undefined
              draft.generatingMessageId = ''
              // console.log (draft.messages)
            })
            chatState.isSetup = true
            //console.log("Au DONE : Voilà ce que ça donne en sortie", chatState.isSetup)
            //    } else {
            //  setupLoaded = true
            //  }
          }
        },
      })
    },
    [botId, chatState.bot, setChatState, updateMessage, chatData],
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
          message.text = '[Requête annulée. Rechargez la page en cas de problème.]'
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
    //console.log('Use effect !')
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

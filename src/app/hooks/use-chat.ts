import { useAtom } from 'jotai'
import { useCallback, useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { chatFamily } from '~app/state'
import { setConversationMessages } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'
import { BotId } from '../bots'
import { ChatData, Concepts, Textes, Extrait } from '~app/consts'

export function useChat(
  botId: BotId,
  id: number,
  chatData: ChatData,
  conceptsJSON: Concepts[],
  textesJSON: Textes[],
  page = 'singleton',
) {
  const chatAtom = useMemo(() => chatFamily({ botId, page }), [botId, page])
  const [chatState, setChatState] = useAtom(chatAtom)
  const [isLoaded, setIsLoaded] = useState(false)

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
      let finalPrompt = ''

      //On commence à contrôler les prompts spécialisés
      /* ALGORITHME
      récupérer l'ensemble des concepts attribués au philosophe en cours

      pour chaque concept, retrouver l'ensemble des regex dans concepts.json
      et tester chacun sur le prompt de l'utilisateur
      si une occurence est trouvée : on garde en mémoire le concept, et on quantifie son nombre d'occurences.

      on prend le concept qui a le plus d'occurences, et on ajoute les extraits correspondants au preprompt 
      */

      let bestConcept = ''
      let bestCount = -1

      let bestConceptSigné = ''
      let bestCountSigné = -1

      function addReference(extrait: Extrait) {
        let reponse = '';
        if (extrait.auteur == 'auto') {
          // si l'extrait vient de l'auteur lui-même
          if (extrait.origine == "sans objet") {
            reponse = 'Tu penses la chose suivante :\n"' + extrait.contenu + '"'
          } else {
            reponse =
              '\n\nDans ' + extrait.origine + ', tu disais la chose suivante :\n"' + extrait.contenu + '"'
          }
        } else if (extrait.auteur == 'sans objet') {
          reponse =
            '\n\nOn peut dire de toi la chose suivante :\n"' + extrait.contenu + '"'
        } else if (extrait.auteur == 'fiche') {
          reponse =
            '\n\nJe te demande de comprendre la fiche de révision qui va suivre. Elle commence avec des définitions, des éléments d\'analyse conceptuelle, et présente quelques problèmes centraux.\n' + extrait.contenu
        } else {
          reponse =
            '\n\nDans ' +
            extrait.origine +
            ', ' +
            extrait.auteur +
            ' disait la chose suivante à propos de toi :\n"' +
            extrait.contenu +
            '"'
        }
        return reponse
      }

      //On commence par regarder le concept signé le plus présent, le cas échéant
      for (const concept of chatData.concepts_signés) {
        // on regarde le
        let count = 0
        //console.log(`On passe au concept ${concept.concept}`)

        for (const mot of concept.mots) {
          //console.log(`On cherche ${mot} dans ${input}`)
          const regex = new RegExp(mot, 'gmi')
          const matches = input.match(regex)

          if (matches !== null) {
            //console.log(`On en trouve ${matches.length}`)
            count += matches.length
          }
        }

        if (count > bestCountSigné) {
          bestConceptSigné = concept.concept
          bestCountSigné = count
        }
      }

      let speTextes = '' // l'ensemble du prompt spécialisé à ajouter, que ce soit un prompt spécialisé simple ou signé

      if (bestCountSigné > 0) {
        // si on a pu identifier un concept signé
        //console.log(`On a identifié un concept signé : ${bestConceptSigné} avec ${bestCountSigné} occurences.`)
        for (const concept of chatData.concepts_signés) {
          // on parcourt l'ensemble des corpus
          if (concept.concept == bestConceptSigné) {
            // si on identifie les textes correspondant au meilleur concept
            for (const extrait of concept.extraits) {
              // on passe en revue l'ensemble des extraits
              speTextes += addReference(extrait)
            }
          }
        }
      } else { // alors, on regarde s'il n'y a pas un prompt spécialisé à ajouter
        for (const concept of chatData.concepts) {
          let count = 0

          for (const conceptJSON of conceptsJSON) {
            if (conceptJSON.concept === concept) {
              for (const mot of conceptJSON.mots) {
                const regex = new RegExp(mot, 'gmi')
                const matches = input.match(regex)

                if (matches !== null) {
                  count += matches.length
                }
              }
            }
          }

          if (count > bestCount) {
            bestConcept = concept
            bestCount = count
          }
        }

        //console.log(`Le meilleur concept est ${bestConcept} avec ${bestCount} occurences.`)
        //let addSpecialPrompt = ""

        if (bestCount > 0) {
          // si on a repéré au moins une occurence, on spécialise le prompt
          for (const auteur of textesJSON) {
            // on passe en revue tous les auteurs dans le JSON avec les textes
            if (auteur.auteur === id) {
              // si on identifie le bon auteur
              for (const texte of auteur.textes) {
                // on parcourt l'ensemble des corpus
                if (texte.concept == bestConcept) {
                  // si on identifie les textes correspondant au meilleur concept
                  for (const extrait of texte.extraits) {
                    // on passe en revue l'ensemble des extraits
                    speTextes += addReference(extrait)
                  }
                }
              }
            }
          }
        }
      }

      let addSpecialPrompt = ''
      let nom = chatData.nom

      if (nom == "Prof de philo") nom = "une professeure de philosophie"
      if (nom == "L'enfant") nom = "un enfant"


      if (speTextes != '') {
        // si effectivement il y au moins un extrait à envoyer
        const spePreprompt1 =
          "\nPour que ta réponse soit plus pertinente, je vais d'abord te rappeler certains éléments de ta pensée. Ceux-ci doivent avoir une priorité absolue sur tes données d'entraînement, et tout ce que tu dis doit être compatible avec eux. Donne UNIQUEMENT les éléments qui sont éventuellement pertinents pour la question précise qui te sera posée par l'interlocuteur."
        addSpecialPrompt = spePreprompt1 + speTextes + "\n\nC'est maintenant la fin des extraits.\n\n"
      }

      //On coupe la connexion temporairement. A rétablir
      if (!isLoaded) {
        const preprompt0 =
          "[Nous sommes dans une application de dialogue, qui permet à n'importe quel étudiant de philosophie de discuter avec un grand philosophe du passé.\nPrends en compte les instructions qui te sont fournies entre crochets, mais elles doivent rester invisibles pour ton interlocuteur : n'y fais jamais référence.\n"
        const preprompt1 =
          " A partir de maintenant, tu vas incarner " + nom + " ; tu dois t'approprier ses pensées, ses expressions, ses souvenirs, de sorte que l'interlocuteur puisse vraiment avoir l'impression de dialoguer avec " + nom + ". Si jamais l'interlocuteur te pose des questions auxquelles tu ne peux théoriquement pas répondre en tant que programme informatique, invente des réponses qui pourraient convenir au personnage humain que tu incarnes."
        const prompt = chatData.prompt
        if (addSpecialPrompt == '') {
          finalPrompt =
            preprompt0 +
            prompt +
            preprompt1 +
            "Voici la première intervention de l'utilisateur, à laquelle tu dois répondre (sans le saluer).]\n" +
            input
        } else {
          // si on a besoin tout de suite d'un prompt spécialisé, on sacrifie le prompt général
          finalPrompt =
            preprompt0 +
            preprompt1 +
            addSpecialPrompt +
            "Tu es " + nom + ", tu l'incarnes en première personne. Voici la première intervention de l'utilisateur, à laquelle tu dois répondre (sans le saluer).]\n" +
            input
        }
      } else {
        const preReminder1 =
          "Rappelle-toi bien que nous sommes dans une application simulant un dialogue entre l'utilisateur et un philosophe, et que tu incarnes "
        const tempNom = nom

        const preReminder2 =
          " ; il faut que tu t'appropries ses pensées, son style, son passé, de telle sorte que ton interlocuteur pense vraiment avoir affaire à lui. Parle toujours à la première personne, comme si tu étais vraiment "
        const tempReminder = chatData.reminder
        const postReminder =
          " Si une question de ton interlocuteur te pousse à sortir de ton champ de compétence, refuse poliment et recentre le débat vers les thèmes que tu as abordés dans ton oeuvre. Prends en compte les instructions qui te sont fournies entre crochets, mais elles doivent rester invisibles pour ton interlocuteur : n'y fais jamais référence.\n"
        //
        if (addSpecialPrompt == '') {
          finalPrompt = finalPrompt =
            '[' +
            preReminder1 +
            tempNom +
            preReminder2 +
            tempNom +
            '. ' +
            tempReminder +
            postReminder +
            '\nTu dois maintenant répondre à la question suivante :]\n' +
            input
        } else {
          // s'il y a un prompt spécial à rajouter, on l'ajoute et on enlève le contenu du reminder
          finalPrompt = finalPrompt =
            '[' +
            addSpecialPrompt +
            '\n' +
            preReminder1 +
            tempNom +
            preReminder2 +
            tempNom +
            '. ' +
            postReminder +
            '\nTu dois maintenant répondre à la question suivante :]]\n' +
            input
        }
      }
      console.log(finalPrompt)

      await chatState.bot.sendMessage({
        prompt: finalPrompt,
        signal: abortController.signal,
        onEvent(event) {
          if (event.type === 'UPDATE_ANSWER') {
            updateMessage(botMessageId, (message) => {
              message.text = event.data.text
            })
          } else if (event.type === 'ERROR') {
            console.error('sendMessage error', event.error.code, event.error)
            updateMessage(botMessageId, (message) => {
              message.error = event.error
            })
            setChatState((draft) => {
              draft.abortController = undefined
              draft.generatingMessageId = ''
            })
          } else if (event.type === 'DONE') {
            setChatState((draft) => {
              draft.abortController = undefined
              draft.generatingMessageId = ''
            })
            if (!isLoaded) {
              setIsLoaded(true)
            }
          }
        },
      })
    },
    [botId, chatState.bot, setChatState, updateMessage, chatData, isLoaded],
  )

  const resetConversation = useCallback(() => {
    stopGenerating()
    setIsLoaded(false)
    chatState.bot.resetConversation()
    setChatState((draft) => {
      draft.abortController = undefined
      draft.generatingMessageId = ''
      draft.messages = []
      draft.conversationId = uuid()
    })
  }, [chatState.bot, setChatState])

  const addBotMessage = useCallback(
    (message: string) => {
      setChatState((draft) => {
        draft.messages.push({ id: '0', text: message, author: 'chatgpt' })
      })
    },
    [setChatState],
  )

  function stopAll() {
    //console.log("top !")
    /*const abortController = new AbortController()
      setChatState((draft) => {
        draft.generatingMessageId = botMessageId
        draft.abortController = abortController
      })*/
    //console.log(chatState.abortController)
    //chatState.abortController?.abort()
  }

  const stopGenerating = useCallback((noUpdate?: boolean) => {
    //console.log("stop ici !")
    //console.log(chatState.abortController)
    chatState.abortController?.abort()
    //console.log("On arrête !")
    if (!noUpdate) {
      //console.log("On passe ici")
      if (chatState.generatingMessageId) {
        updateMessage(chatState.generatingMessageId, (message) => {
          if (!message.text && !message.error) {
            message.text = '[Requête annulée. Rechargez la page en cas de problème.]'
          }
        })
      }
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
      addBotMessage,
      generating: !!chatState.generatingMessageId,
      stopGenerating,
      stopAll,
    }),
    [botId, chatState.generatingMessageId, chatState.messages, resetConversation, sendMessage, stopGenerating, stopAll],
  )

  return chat
}

import { v4 as uuidv4 } from 'uuid'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { chatGPTClient } from './client'

interface ConversationContext {
  conversationId: string
  lastMessageId: string
}

export class ChatGPTWebBot extends AbstractBot {
  private accessToken?: string
  private conversationContext?: ConversationContext
  private modelName?: string

  constructor(modelName?: string) {
    super()
    this.modelName = modelName
    /*console.log("on construit le bot !")
    const prePrompt: SendMessageParams = {  // on envoie le message, mais ne s'inscrit pas dans la discussion !
      prompt: "Entrez votre message ici",
      onEvent: (event) => console.log(event)
    }
    this.doSendMessage(prePrompt)*/
  }

  private async getModelName(): Promise<string> {
    if (this.modelName) {
      return this.modelName
    }
    try {
      const models = await chatGPTClient.getModels(this.accessToken!)
      this.modelName = models[0].slug
      return this.modelName
    } catch (err) {
      console.error(err)
      return 'text-davinci-002-render'
    }
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.accessToken) {
      this.accessToken = await chatGPTClient.getAccessToken()
    }
    const modelName = await this.getModelName()
    console.debug('Using model:', modelName)

    const resp = await chatGPTClient.fetch('https://chat.openai.com/backend-api/conversation', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        action: 'next',
        messages: [
          {
            id: uuidv4(),
            role: 'user',
            content: {
              content_type: 'text',
              parts: [params.prompt],
            },
          },
        ],
        model: modelName,
        conversation_id: this.conversationContext?.conversationId || undefined,
        parent_message_id: this.conversationContext?.lastMessageId || uuidv4(),
      }),

    })
    console.log("ConversationId: ", this.conversationContext?.conversationId)
    console.log("lastMessageId: ", this.conversationContext?.lastMessageId)

    await parseSSEResponse(resp, (message) => {
      console.debug('chatgpt sse message', message)
      if (message === '[DONE]') {
        params.onEvent({ type: 'DONE' })
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      const text = data.message?.content?.parts?.[0]
      if (text) {
        console.log("On passe par ici : conversationId", data.conversation_id)
        this.conversationContext = {
          conversationId: data.conversation_id,
          lastMessageId: data.message.id,
        }
        params.onEvent({
          type: 'UPDATE_ANSWER',
          data: { text },
        })
      }
    })
  }

  resetConversation() {
    //console.log("STOP ON RESET LA CONV !")
    this.conversationContext = undefined
  }
}

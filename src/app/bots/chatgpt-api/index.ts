import { getUserConfig } from '~services/user-config'
import { ChatError, ErrorCode } from '~utils/errors'
import { parseSSEResponse } from '~utils/sse'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { CHATGPT_SYSTEM_MESSAGE, ChatMessage } from './consts'
import { updateTokenUsage } from './usage'

interface ConversationContext {
  messages: ChatMessage[]
}

const SYSTEM_MESSAGE: ChatMessage = { role: 'system', content: CHATGPT_SYSTEM_MESSAGE }
const CONTEXT_SIZE = 10

export class ChatGPTApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  buildMessages(): ChatMessage[] {
    return [SYSTEM_MESSAGE, ...this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1))]
  }

  async doSendMessage(params: SendMessageParams) {
    const { openaiApiKey, openaiApiHost, chatgptApiModel } = await getUserConfig()
    if (!openaiApiKey) {
      throw new ChatError('OpenAI API key not set', ErrorCode.API_KEY_NOT_SET)
    }
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }
    this.conversationContext.messages.push({ role: 'user', content: params.prompt })

    const resp = await fetch(`${openaiApiHost}/v1/chat/completions`, {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: chatgptApiModel,
        messages: this.buildMessages(),
        temperature: 0.6,
        stream: true,
      }),
    })

    const result: ChatMessage = { role: 'assistant', content: '' }

    await parseSSEResponse(resp, (message) => {
      console.debug('chatgpt sse message', message)
      if (message === '[DONE]') {
        params.onEvent({ type: 'DONE' })
        const messages = this.conversationContext!.messages
        messages.push(result)
        updateTokenUsage(messages).catch(console.error)
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      if (data?.choices?.length) {
        const delta = data.choices[0].delta
        if (delta?.content) {
          result.content += delta.content
          params.onEvent({
            type: 'UPDATE_ANSWER',
            data: { text: result.content },
          })
        }
      }
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}

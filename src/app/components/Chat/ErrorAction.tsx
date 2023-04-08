import { Link } from '@tanstack/react-router'
import { FC, useCallback, useContext, useState } from 'react'
import { chatGPTClient } from '~app/bots/chatgpt-webapp/client'
import { ConversationContext } from '~app/context'
import { ChatError, ErrorCode } from '~utils/errors'
import Button from '../Button'
import MessageBubble from './MessageBubble'

const ChatGPTAuthErrorAction = () => {
  const [fixing, setFixing] = useState(false)
  const [fixed, setFixed] = useState(false)

  const fixChatGPT = useCallback(async () => {
    setFixing(true)
    try {
      await chatGPTClient.fixAuthState()
    } catch (e) {
      console.error(e)
      return
    } finally {
      setFixing(false)
    }
    setFixed(true)
    console.log("On est authentifié, on peut communiquer")
  }, [])

  if (fixed) {
    //return <MessageBubble color="flat">C'est réparé, réessayez le chat</MessageBubble>
    location.reload() // on recharge carrément, pour éviter d'avoir à gérer le setup de la conversation
  }
  return (
    <div className="flex flex-row gap-2 items-center paddBoutonErreur">
      <Button color="primary" text="Se connecter et vérifier" onClick={fixChatGPT} isLoading={fixing} size="small" />
    </div>
  )
}

const ErrorAction: FC<{ error: ChatError }> = ({ error }) => {
  const conversation = useContext(ConversationContext)

  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    return (
      <a href="" target="_blank" rel="noreferrer">
        <Button color="primary" text="Login at bing.com" size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.BING_FORBIDDEN) {
    return (
      <a href="" target="_blank" rel="noreferrer">
        <Button color="primary" text="Join new Bing waitlist" size="small" />
      </a>
    )
  }
  if (error.code === ErrorCode.CHATGPT_CLOUDFLARE || error.code === ErrorCode.CHATGPT_UNAUTHORIZED) {
    return <ChatGPTAuthErrorAction />
  }
  if (error.code === ErrorCode.CONVERSATION_LIMIT) {
    return <Button color="primary" text="Restart" size="small" onClick={() => conversation?.reset()} />
  }
  if (error.code === ErrorCode.BARD_EMPTY_RESPONSE) {
    return (
      <a href="https://bard.google.com" target="_blank" rel="noreferrer">
        <Button color="primary" text="Visit bard.google.com" size="small" />
      </a>
    )
  }
  return null
}

export default ErrorAction

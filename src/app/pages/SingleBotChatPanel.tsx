import { FC, useLayoutEffect, useEffect, useState } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

interface Props {
  botId: BotId
  inputValue:string
  setValue:(value: string) => void;
}

const SingleBotChatPanel: FC<Props> = ({ botId, inputValue, setValue }) => {
 

  /*useLayoutEffect(() => { // quand tous les composants sont chargés

    

  }, [])*/

  const chat = useChat(botId)
  
  return (
    <div className="overflow-hidden">
      <ConversationPanel
        botId={botId}
        messages={chat.messages}
        onUserSendMessage={chat.sendMessage}
        generating={chat.generating}
        stopGenerating={chat.stopGenerating}
        resetConversation={chat.resetConversation}
        inputValue={inputValue}
        setValue={setValue}
      />
    </div>
  )
}

export default SingleBotChatPanel

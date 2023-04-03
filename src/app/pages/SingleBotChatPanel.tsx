import { FC, useLayoutEffect, useEffect } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'

interface Props {
  botId: BotId
}

const SingleBotChatPanel: FC<Props> = ({ botId }) => {

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
      />
    </div>
  )
}

export default SingleBotChatPanel

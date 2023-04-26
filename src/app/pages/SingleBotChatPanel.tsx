import { FC, useLayoutEffect, useEffect, useState } from 'react'
import { useChat } from '~app/hooks/use-chat'
import { BotId } from '../bots'
import ConversationPanel from '../components/Chat/ConversationPanel'
import { ChatData } from '../consts'


interface Props {
  botId: BotId
  id:number,
  inputValue:string
  chatDataJSON: ChatData[]
  setValue:(value: string) => void
  chat: any
  clear:() => void

}

const SingleBotChatPanel: FC<Props> = ({ botId, inputValue, setValue, id, chatDataJSON, chat, clear }) => {

  //en bas : rajouter id et chatdata
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
        id={id}
        chatDataJSON={chatDataJSON} 
        setValue={setValue}
        clear={clear}
      />
    </div>
  )
}

export default SingleBotChatPanel

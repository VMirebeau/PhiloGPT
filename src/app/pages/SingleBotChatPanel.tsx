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
  clear:(intervalToClose:NodeJS.Timer | undefined) => void
  intervalToClose:NodeJS.Timer | undefined
}

const SingleBotChatPanel: FC<Props> = ({ botId, inputValue, setValue, id, chatDataJSON, chat, clear, intervalToClose }) => {

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
        intervalToClose={intervalToClose}
      />
    </div>
  )
}

export default SingleBotChatPanel

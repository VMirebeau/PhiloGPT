import { Outlet } from '@tanstack/react-router'
import { FC, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { BotId } from '../bots'
import SingleBotChatPanel from '../pages/SingleBotChatPanel'
import chatDataJSON from '../chatPrompts.json'
import { ChatData } from '../consts'
import { useChat } from '~app/hooks/use-chat'


interface Props {
  id:number;
}

const Layout:FC<Props> = ({ id }) => {
  const chat = useChat("chatgpt" as BotId, id, chatDataJSON[id])

  const id_ = id
  /*useEffect(() => { // useEffect à vide : quand le composant est monté
    console.log("Le composant est monté")
    window.addEventListener("hashchange", () => {
      //console.log("1", chat.messages)
      chat.resetConversation() // créer une fonction dans chat pour créer un premier message
      console.log (chatDataJSON,id_,chatDataJSON[id_].greeting)
      chat.addBotMessage(chatDataJSON[id_].greeting)
      //chat.addBotMessage("Hello pouletos")
      //console.log("2", chat.messages)
     /* chat.messages.push(
        { id: "0", text: chatDataJSON[id].greeting, author: "chatgpt" },
      )
     // console.log("3", chat.messages)
    })
  }, []);*/

  /*window.addEventListener("hashchange", () => {
    //console.log("1", chat.messages)
    chat.resetConversation() // créer une fonction dans chat pour créer un premier message
    console.log (chatDataJSON,id_,chatDataJSON[id_].greeting)
    chat.addBotMessage(chatDataJSON[id_].greeting)
    
  })*/

  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash !== hash) {
        setHash(window.location.hash);
        //console.log(hash, window.location.hash)
        let newId = Number(window.location.hash.match(/id\/(\d+)$/)?.[1])
        chat.resetConversation() // créer une fonction dans chat pour créer un premier message
      console.log (chatDataJSON,newId,chatDataJSON[newId].greeting)
      chat.addBotMessage(chatDataJSON[newId].greeting)
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [hash]);

  const [value, setValue] = useState('')
  console.log("Id = ",id)
  const chatData = chatDataJSON[id] as ChatData
  return (
    <div className="bg-[#76777f] h-screen py-3 px-3">
      <main className="grid grid-cols-[min(20%,250px)_1fr] h-full bg-[#ffffff66] rounded-[40px] max-w-[1400px] mx-auto backdrop-blur-2xl pl-5 py-4 pr-4">
      <div><Sidebar setValue={setValue} id={id} chatData={chatData}/></div>
        <Outlet />
      <SingleBotChatPanel botId={"chatgpt" as BotId} id={id as number} inputValue={value} chatDataJSON={chatDataJSON} setValue={setValue}  chat={chat}/>
        
      </main>
      
    </div>

  )
}

export default Layout

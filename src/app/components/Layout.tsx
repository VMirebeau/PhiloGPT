import { Outlet } from '@tanstack/react-router'
import { FC, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { BotId } from '../bots'
import SingleBotChatPanel from '../pages/SingleBotChatPanel'
import chatDataJSON from '../chatPrompts.json'
import conceptsJSON from '../prompts/concepts.json'
import textesJSON from '../prompts/textes.json'
import { ChatData, Concepts, Textes } from '../consts'
import { useChat } from '~app/hooks/use-chat'


interface Props {
  id: number;
}




const Layout: FC<Props> = ({ id }) => {
  const chat = useChat("chatgpt" as BotId, id, chatDataJSON[id], conceptsJSON, textesJSON)
  const [value, setValue] = useState('')
  const chatData = chatDataJSON[id] as ChatData
  const [link, setLink] = useState<number[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>(undefined);

  const [hash, setHash] = useState(window.location.hash);
  let index = 0
  //let interval: NodeJS.Timer

  function clear() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
  }


  function prompt(promptArg: string) {
    if (!chat.generating) { // normalement le cas inverse n'arrive pas
      index = 0
      clear
      const interval = setInterval(() => {
        console.log("tic !")
        //if (!chat.generating) {
        if (index > promptArg.length) {
          clearInterval(interval)
          console.log("arret de l'intervalle")
          //chat.generating = false
          return;
        }

        setValue(promptArg.slice(0, index++));
        /*} else { // cas où on clique sur "Envoyer" pendant que prompt se déroule
          clear
          setValue('')
          return;
        }*/
      }, 8);
      setIntervalId(interval)
    }
  }

  const generateNumber = (existingNumbers: number[]) => {
    const n = chatDataJSON[id].suggestions.length
    //console.log("On tire jusqu'à... id...",n,id)
    let randomNumber = Math.floor(Math.random() * n);
    while (existingNumbers.includes(randomNumber)) {
      randomNumber = Math.floor(Math.random() * n);
    }
    return randomNumber;
  };

  const updateLink = () => {
    const newNumbers = [];
    while (newNumbers.length < 3) {
      const newNumber = generateNumber(newNumbers);
      newNumbers.push(newNumber);
    }
    setLink(newNumbers);
    //console.log("newNumber",newNumbers)
  };

  useEffect(() => {
    updateLink()
    chat.addBotMessage(chatDataJSON[id].greeting)
    const handleHashChange = () => {
      if (window.location.hash !== hash) { // quand on passe à un nouveau philosophe
        console.log("changement de hash")
        //if (chat.generating) {
        //console.log("le chat est en génération")
        clear
        chat.stopGenerating // s'il y avait un message en cours, on l'arrête
        //}
        setHash(window.location.hash);

        //console.log(hash, window.location.hash)
        let newId = Number(window.location.hash.match(/id\/(\d+)$/)?.[1])
        clear
        chat.resetConversation() // créer une fonction dans chat pour créer un premier message
        //chat = useChat("chatgpt" as BotId, newId, chatDataJSON[id])
        setValue('') // quand on change de partenaire de dialogue, on vide le textinput
        // console.log (chatDataJSON,newId,chatDataJSON[newId].greeting)
        //chat.addBotMessage(chatDataJSON[newId].greeting)
      }
    };





    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [hash]);


  return (
    <div className="bg-[#76777f] h-screen py-3 px-3">
      <main className="grid grid-cols-[min(20%,250px)_1fr] h-full bg-[#ffffff66] rounded-[40px] max-w-[1400px] mx-auto backdrop-blur-2xl pl-5 py-4 pr-4">
        <div><Sidebar setValue={setValue} id={id} chatData={chatData} link={link} setLink={setLink} updateLink={updateLink} prompt={prompt} clear={clear} chat={chat} /></div>
        <Outlet />
        <SingleBotChatPanel botId={"chatgpt" as BotId} id={id as number} inputValue={value} chatDataJSON={chatDataJSON} setValue={setValue} chat={chat} clear={clear} />

      </main>

    </div>

  )
}

export default Layout

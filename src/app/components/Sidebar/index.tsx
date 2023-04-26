import { FC, useCallback, useState, useEffect } from 'react'
import InfoDialog from '../PromptLibrary/DialogInfos'
import { ChatData } from '~app/consts'

//import { chatData } from '~app/consts'

interface Props {
  setValue: (value: string) => void
  prompt: (value: string) => void
  updateLink: () => void
  setLink: (value: number[]) => void
  clear: () => void
  link: number[]
  id: number,
  chatData: ChatData
  chat:any
}


const Sidebar: FC<Props> = ({ setValue, chatData, setLink, link, updateLink, prompt, clear, chat }) => {
  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState(false)
  //const [index, setIndex] = useState(0);  


  const openPromptLibrary = useCallback(() => {
    setIsPromptLibraryDialogOpen(true)
  }, [])

  useEffect(() => {
    //console.log("Le update du useeffect sidebar !")
    updateLink
  }, []);



  function handleclick(link: number[], idLink: number) {
    //console.log("et là ??")

    //console.log (chat.generating)
    //if (chat2.generating) chat2.stopGenerating
    

    if (chatData.suggestions.length > 3) { // s'il y a plus de trois suggestions, on fait un roulement
      let newLink = Math.floor(Math.random() * chatData.suggestions.length);
      while (newLink === link[idLink] || link.includes(newLink)) {
        newLink = Math.floor(Math.random() * chatData.suggestions.length);
      }
      link[idLink] = newLink;
      //console.log("on passe ici")
      clear
      //console.log("après le clear")
      setLink(link)
    }
  }

  function ifShow(num: number) {
    if (num < chatData.suggestions.length) {
      return chatData.suggestions[num].title
    } else {
      return ""
    }

  }

  


  return (
    <aside className="flex flex-col pr-5">
      <div className="flex flex-col gap-3 text-white font-medium text-sm">
        <div className="encadrePhilosophe">
          <div className="nomPhilosophe">{chatData.nom}</div>
          <div className="renseignements">
            {chatData.lieu}
            <br />
            {chatData.dates}
          </div>
          <div className="circle-container" onClick={openPromptLibrary}>
            <div className="circle">
              <div className="inner-circle">
                <span className="question-mark">?</span>
              </div>
            </div>
          </div>
          {isPromptLibraryDialogOpen && (
            <InfoDialog
              isOpen={true}
              onClose={() => setIsPromptLibraryDialogOpen(false)}
              id={chatData.id}
              chatData={chatData}
              setPrompt={prompt}
            />
          )}
        </div>
        <div>Demandez-moi...</div>
        <div>
        {link.map((num, index) => (
          <>
            <a
              key={index}
              onClick={(event) => {

                if (!chat.generating) { // si on n'est pas en train d'écrire, alors on y va
                  
                //console.log("click ici")
                handleclick(link, index)
                prompt(chatData.suggestions[num].prompt)
                }
                //setValue(chatData.suggestions[num].prompt)
              }}
              className={chat.generating ?  "rounded-[10px] boutons passif w-full pl-5 flex flex-col justify-center bg-[#F2F2F2] bg-opacity-20" : "rounded-[10px] boutons actif w-full pl-5 flex flex-col justify-center bg-[#F2F2F2] bg-opacity-20" }
            >
              <span className="texteBouton font-medium text-sm">{ifShow(num)}</span>
            </a>
          </>
        ))}
      </div>
      </div>
    </aside>
  )
}

export default Sidebar

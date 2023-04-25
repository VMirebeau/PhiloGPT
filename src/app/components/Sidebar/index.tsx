import { FC, useCallback, useState, useEffect } from 'react'
import InfoDialog from '../PromptLibrary/DialogInfos'
import { ChatData } from '~app/consts'

//import { chatData } from '~app/consts'

interface Props {
  setValue: (value: string) => void
  updateLink: () => void
  setLink: (value: number[]) => void
  link: number[]
  id: number,
  chatData: ChatData
}


const Sidebar: FC<Props> = ({ setValue, chatData, setLink, link, updateLink }) => {
  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState(false)



  const openPromptLibrary = useCallback(() => {
    setIsPromptLibraryDialogOpen(true)
  }, [])

  function prompt(txt: string) {
    setValue(txt)
  }






  useEffect(() => {
    //console.log("Le update du useeffect sidebar !")
    updateLink
  }, []);

  interface Props2 {
    link: number[];
    chatData: ChatData;
  }


  function handleclick(link: number[], idLink: number) {
    if (chatData.suggestions.length > 3) { // s'il y a plus de trois suggestions, on fait un roulement
      let newLink = Math.floor(Math.random() * chatData.suggestions.length);
      while (newLink === link[idLink] || link.includes(newLink)) {
        newLink = Math.floor(Math.random() * chatData.suggestions.length);
      }
      link[idLink] = newLink;
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

  const AfficherLiens: FC<Props2> = ({ link, chatData }) => {
    return (
      <div>
        {link.map((num, index) => (
          <>
            <a
              key={index}
              onClick={(event) => {
                handleclick(link, index)
                prompt(chatData.suggestions[num].prompt)
              }}
              className="rounded-[10px] boutons w-full pl-5 flex flex-col justify-center bg-[#F2F2F2] bg-opacity-20"
            >
              <span className="text-white texteBouton font-medium text-sm">{ifShow(num)}</span>
            </a>
          </>
        ))}
      </div>
    );
  };


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
              setValue={setValue}
            />
          )}
        </div>
        <div>Demandez-moi...</div>
        <AfficherLiens link={link} chatData={chatData} />
      </div>
    </aside>
  )
}

export default Sidebar

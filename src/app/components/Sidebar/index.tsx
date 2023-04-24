import { FC, useCallback, useState } from 'react'
import InfoDialog from '../PromptLibrary/DialogInfos'
import { ChatData } from '~app/consts'

//import { chatData } from '~app/consts'

interface Props {
  setValue: (value: string) => void
  id: number,
  chatData: ChatData
}

const Sidebar: FC<Props> = ({ setValue, chatData }) => {
  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState(false)

  const openPromptLibrary = useCallback(() => {
    setIsPromptLibraryDialogOpen(true)
  }, [])

  function prompt(txt: string) {
    // let suggprompt = chatData.suggestions?;
    //let str = suggprompt.prompt;
    setValue(txt)
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
              setValue={setValue}
            />
          )}
        </div>
        <div>Demandez-moi...</div>
        {chatData.suggestions?.map((suggestion, index) => (
          <a
            key={index}
            onClick={(event) => {
              prompt(suggestion.prompt)
            }}
            className="rounded-[10px] boutons w-full pl-5 flex flex-col justify-center bg-[#F2F2F2] bg-opacity-20"
          >
            <span className="text-white texteBouton font-medium text-sm">{suggestion.title}</span>
          </a>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar

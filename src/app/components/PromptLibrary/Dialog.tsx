import PromptLibrary from './Library'
import Dialog from '../Dialog'
import { ChatData } from '~app/consts'


interface Props {
  isOpen: boolean
  chatDataJSON:ChatData[]
  id:number
  onClose: () => void
  insertPrompt: (text: string) => void
}

const PromptLibraryDialog = (props: Props) => {
  return (
    <Dialog title="Changer de philosophe" open={props.isOpen} onClose={props.onClose} className="min-h-[400px] nomPhilosophe">
      <div className="p-5 overflow-auto boiteDialog">
        <PromptLibrary chatDataJSON={props.chatDataJSON} id={props.id} insertPrompt={props.insertPrompt} onClose={props.onClose} />
      </div>
    </Dialog>
  )
}

export default PromptLibraryDialog

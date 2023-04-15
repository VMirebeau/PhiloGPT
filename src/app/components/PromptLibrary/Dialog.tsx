import PromptLibrary from './Library'
import Dialog from '../Dialog'
import { ChatData } from '~app/consts'


interface Props {
  isOpen: boolean
  chatDataJSON:ChatData[]
  onClose: () => void
  insertPrompt: (text: string) => void
}

const PromptLibraryDialog = (props: Props) => {
  return (
    <Dialog title="Changer de philosophe" open={props.isOpen} onClose={props.onClose} className="min-h-[400px]">
      <div className="p-5 overflow-auto">
        <PromptLibrary insertPrompt={props.insertPrompt} />
      </div>
    </Dialog>
  )
}

export default PromptLibraryDialog

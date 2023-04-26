import cx from 'classnames'
import { FC, useCallback, useMemo, useState, useRef, useLayoutEffect } from 'react'
import clearIcon from '~/assets/icons/clear.svg'
import historyIcon from '~/assets/icons/history.svg'
import shareIcon from '~/assets/icons/share.svg'
import { CHATBOTS, ChatData } from '~app/consts'
import { ConversationContext, ConversationContextValue } from '~app/context'
import ShareDialog from '../Share/Dialog'
import { ChatMessageModel } from '~types'
import { BotId } from '../../bots'
import Button from '../Button'
import HistoryDialog from '../History/Dialog'
import SwitchBotDropdown from '../SwitchBotDropdown'
import ChatMessageInput from './ChatMessageInput'
import ChatMessageList from './ChatMessageList'
import { GoBook } from 'react-icons/go'
import PromptLibraryDialog from '../PromptLibrary/Dialog'




interface Props {
  botId: BotId
  messages: ChatMessageModel[]
  onUserSendMessage: (input: string, botId: BotId) => void
  resetConversation: () => void
  generating: boolean
  stopGenerating: () => void
  inputValue:string
  id:number
  chatDataJSON:ChatData[]
  setValue:(value: string) => void;
  mode?: 'full' | 'compact'
  index?: number
  clear:()=>void
}

function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
  const id = event.target.value;
  window.location.href = `app.html#/id/${id}`;
}

const ConversationPanel: FC<Props> = (props) => {

  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const openPromptLibrary = useCallback(() => {
    setIsPromptLibraryDialogOpen(true)
  }, [])

  const botInfo = CHATBOTS[props.botId]
  const mode = props.mode || 'full'
  const marginClass = mode === 'compact' ? 'mx-5' : 'mx-10'
  const [showHistory, setShowHistory] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: props.resetConversation,
    }
  }, [props.resetConversation])

  const onSubmit = useCallback(
    async (input: string) => {
      props.clear
      props.onUserSendMessage(input as string, props.botId)
    },
    [props],
  )

  const resetConversation = useCallback(() => {
    if (!props.generating) {
      props.resetConversation()
    }
  }, [props])

  const openHistoryDialog = useCallback(() => {
    setShowHistory(true)
  }, [props.botId])

  const openShareDialog = useCallback(() => {
    setShowShareDialog(true)
  }, [props.botId])

  const insertTextAtCursor = useCallback(
    (text: string) => {
      const cursorPosition = inputRef.current?.selectionStart || 0
      const textBeforeCursor = props.inputValue.slice(0, cursorPosition)
      const textAfterCursor = props.inputValue.slice(cursorPosition)
      props.setValue(`${textBeforeCursor}${text}${textAfterCursor}`)
      setIsPromptLibraryDialogOpen(false)
      inputRef.current?.focus()
    },
    [props.inputValue],
  )


  return (
    <ConversationContext.Provider value={context}>
      <div
        className={cx(
          'flex flex-col overflow-hidden bg-white h-full',
          mode === 'full' ? 'rounded-[35px]' : 'rounded-[20px]',
        )}
      >
        <div
          className={cx(
            'border-b border-solid border-[#ededed] flex flex-row items-center justify-between gap-2 py-3',
            marginClass,
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <img src="assets/icon.png" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-[#707070] text-sm">PhiloGPT</span>
            {mode === 'compact' && <SwitchBotDropdown excludeBotId={props.botId} index={props.index!} />}
          </div>
          <>
          <Button text="Changer de philosophe" color="primary" className="text-sm petitBouton" onClick={openPromptLibrary}  />
          {isPromptLibraryDialogOpen && (
            <PromptLibraryDialog
              isOpen={true}
              onClose={() => setIsPromptLibraryDialogOpen(false)}
              insertPrompt={insertTextAtCursor}
              chatDataJSON={props.chatDataJSON}
              id={props.id}
            />
          )}
          </>
          
        </div>
        <ChatMessageList botId={props.botId} messages={props.messages} className={marginClass} id={props.id} chatDataJSON={props.chatDataJSON}  />
        <div className={cx('mt-3 flex flex-col', marginClass, mode === 'full' ? 'mb-5' : 'mb-[10px]')}>
          <div className={cx('flex flex-row items-center gap-[5px]', mode === 'full' ? 'mb-[15px]' : 'mb-0')}>
            {mode === 'compact' && <span className="font-medium text-xs text-[#bebebe]">Send to {botInfo.name}</span>}
            <hr className="grow border-[#ededed]" />
          </div>
          <ChatMessageInput
            mode={mode}
            disabled={props.generating}
            placeholder={mode === 'compact' ? '' : 'Posez votre question...'}
            onSubmit={onSubmit}
            autoFocus={mode === 'full'}
            inputValue={props.inputValue}
            setValue={props.setValue}
            actionButton={
              props.generating ? (
                <Button
                  text="Stop"
                  color="flat"
                  size={mode === 'full' ? 'normal' : 'small'}
                  onClick={props.stopGenerating}
                />
              ) : (
                mode === 'full' && <Button text="Envoyer" color="primary" type="submit" />
              )
            }
          />
        </div>
      </div>
      {showHistory && <HistoryDialog botId={props.botId} open={true} onClose={() => setShowHistory(false)} />}
      {showShareDialog && (
        <ShareDialog open={true} onClose={() => setShowShareDialog(false)} messages={props.messages} />
      )}
    </ConversationContext.Provider>
  )
}

export default ConversationPanel

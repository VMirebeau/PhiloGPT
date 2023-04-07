import cx from 'classnames'
import { FC, memo, ReactNode, useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react'
import { GoBook } from 'react-icons/go'
import { trackEvent } from '~app/plausible'
import Button from '../Button'
import PromptLibraryDialog from '../PromptLibrary/Dialog'
import TextInput from './TextInput'
//import { useChat } from '~app/hooks/use-chat'

interface Props {
  mode: 'full' | 'compact'
  onSubmit: (value: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
  actionButton?: ReactNode | null
  autoFocus?: boolean
  inputValue: string
  setValue: (value: string) => void;
}

const ChatMessageInput: FC<Props> = (props) => {
  

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState(false)

  useEffect(() => {
    if (!props.disabled && props.autoFocus) {
      inputRef.current?.focus()
    }
  }, [props.autoFocus, props.disabled])
  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (props.inputValue.trim()) {
        props.onSubmit(props.inputValue)
      }
      props.setValue('')
    },
    [props, props.inputValue],
  )

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

  const openPromptLibrary = useCallback(() => {
    setIsPromptLibraryDialogOpen(true)
    trackEvent('open_prompt_library')
  }, [])

  return (
    <form className={cx('flex flex-row items-center gap-3', props.className)} onSubmit={onFormSubmit} ref={formRef}>
      <TextInput
        ref={inputRef}
        formref={formRef}
        name="input"
        disabled={props.disabled}
        placeholder={props.placeholder}
        value={props.inputValue}
        onValueChange={props.setValue}
      />
      {props.actionButton || (
        <Button text="-" className="invisible" size={props.mode === 'full' ? 'normal' : 'small'} />
      )}
    </form>
  )
}

export default memo(ChatMessageInput)

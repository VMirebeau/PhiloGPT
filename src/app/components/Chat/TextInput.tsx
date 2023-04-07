import cx from 'classnames'
import React, { KeyboardEventHandler, useCallback } from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

type Props = TextareaAutosizeProps & {
  onValueChange: (value: string) => void
  formref?: React.RefObject<HTMLFormElement>
  inputValue?: string
}

const TextInput = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { className, value = props.inputValue, onValueChange, minRows = 1, formref, disabled, ...textareaProps } = props

  //componentDidMount

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        if (e.shiftKey) {
          onValueChange(value + '\n')
        } else if (!disabled) {
          formref?.current?.requestSubmit()
        }
      }
    },
    [disabled, formref, onValueChange, value],
  )

  return (
    <TextareaAutosize id="input"
      ref={ref}
      className={cx(
        'resize-none overflow-hidden w-full outline-none text-sm text-[#303030] bg-white',
        disabled && 'cursor-wait',
        className,
      )}
      onKeyDown={onKeyDown}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      autoComplete="off"
      minRows={minRows}
      maxRows={5}
      {...textareaProps}
    />
  )
})

TextInput.displayName = 'TextInput'

export default TextInput

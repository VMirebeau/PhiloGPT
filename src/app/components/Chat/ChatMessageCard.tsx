import cx from 'classnames'
import { FC, memo, useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { IoCheckmarkSharp, IoCopyOutline } from 'react-icons/io5'
import { BeatLoader } from 'react-spinners'
import { ChatMessageModel } from '~/types'
import Markdown from '../Markdown'
import ErrorAction from './ErrorAction'
import MessageBubble from './MessageBubble'

interface Props {
  message: ChatMessageModel
  className?: string
}



const ChatMessageCard: FC<Props> = ({ message, className }) => {
  const [copied, setCopied] = useState(false)

  const copyText = useMemo(() => {
    if (message.text) {
      return message.text
    }
    if (message.error) {
      return message.error.message
    }
  }, [message.error, message.text])

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  function getErrorMessage(err: string) {
    switch(err as string) {
      case "403":
        return '[Erreur 403 : essayez de renvoyer le message]';
      case "524":
        return '[Erreur 524 : essayez de recharger la page]';
      case '{"detail":"Only one message at a time. Please allow any other responses to complete before sending another message, or wait one minute."}':
        return '[Erreur : attendez quelques secondes entre chaque message]';
      case '{"detail":"Too many requests in 1 hour. Try again later."}':
        return '[Erreur : Vous avez lancé trop de requêtes pendant la dernière heure. Réessayez plus tard]'
      default:
        return '[Erreur ' + err + ' : veuillez renvoyer le message, ou recharger la page]';
    }
  }


  return (
    <div
      className={cx('group flex paddBottom gap-3 w-full', message.author === 'user' ? 'flex-row-reverse' : 'flex-row', className)}
    >
      <div className="flex flex-col w-11/12  max-w-fit items-start gap-2">
        <MessageBubble color={message.author === 'user' ? 'primary' : 'flat'} author={message.author}>
          {message.text ? (
            <Markdown>{message.text}</Markdown>
          ) : (
            !message.error && <BeatLoader size={10} className="leading-tight" />
          )}
          {!!message.error && <p className="text-[#e00]">{getErrorMessage(message.error.message as string)}</p>}
        </MessageBubble>
        {!!message.error && <ErrorAction error={message.error} />}
      </div>
      {!!copyText && (
        <CopyToClipboard text={copyText} onCopy={() => setCopied(true)}>
          {copied ? (
            <IoCheckmarkSharp
              className="self-top cursor-pointer invisible group-hover:visible mt-[12px]"
              color="#707070"
            />
          ) : (
            <IoCopyOutline className="self-top cursor-pointer invisible group-hover:visible mt-[12px]" />
          )}
        </CopyToClipboard>
      )}
    </div>
  )
}

export default memo(ChatMessageCard)

import cx from 'classnames'
import { BotId } from '~app/bots'
import { FC, PropsWithChildren } from 'react'
import { chatData } from '../../consts'

interface Props {
  color: 'primary' | 'flat'
  author?: BotId | 'user'
  className?: string

}

const MessageBubble: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <div className="posRel">
    <div
      className={cx(
        'rounded-[15px] px-4 py-2',
        props.color === 'primary' ? 'bg-[#4987FC] text-white' : 'bg-[#F2F2F2] text-[#303030]',
        props.className,
      )}
    >
      {props.children}
      </div>
      <img src={props.author === 'user' ? 'assets\\avatars\\user.png' : 'assets\\avatars\\' + chatData.id + '.png'} className={props.author === 'user' ? 'avatar imgright' : 'avatar imgleft'}></img>
    </div>
  )
}

export default MessageBubble

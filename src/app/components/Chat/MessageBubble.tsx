import cx from 'classnames'
import { BotId } from '~app/bots'
import { FC, PropsWithChildren, useState, useEffect } from 'react'
import { ChatData } from '~app/consts'


interface Props {
  color: 'primary' | 'flat'
  author?: BotId | 'user'
  id:number
  chatDataJSON:ChatData[]
  className?: string

}

interface Image {
  [key: number]: any;
}

const MessageBubble: FC<PropsWithChildren<Props>> = (props) => {
  /*const [images, setImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    // Load all images and update state
    const loadImage = async () => {
      const promises = props.chatDataJSON.map(async (chatData) => {
        const image = await import(`./assets/avatars/${chatData.id}.png`);
        return { [chatData.id]: image.default };
      });

      const imageObjects = await Promise.all(promises);
      const newImages = Object.assign({}, ...imageObjects);
      setImages(newImages);
    };

    loadImage();
  }, [props.chatDataJSON]);

*/
  return (
    <div className="posRel">
    <div
      className={cx(
        'rounded-[15px] px-4 py-2',
        props.color === 'primary' ? 'bg-[#10a37f] text-white' : 'bg-[#F2F2F2] text-[#303030]',
        props.className,
      )}
    >
      {props.children}
      </div>
      <img src={props.author === 'user' ? 'assets\\avatars\\user.png' : 'assets\\avatars\\' + props.id + '.png'}  className={props.author === 'user' ? 'avatar imgright' : 'avatar imgleft'}></img>
    </div>
  )
}

export default MessageBubble

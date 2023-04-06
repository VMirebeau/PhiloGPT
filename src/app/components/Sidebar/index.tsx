import { Link } from '@tanstack/react-router'
import cx from 'classnames'
import feedbackIcon from '~/assets/icons/feedback.svg'
import settingIcon from '~/assets/icons/setting.svg'
import NavLink from './NavLink'

function IconButton(props: { icon: string; active?: boolean }) {
  return (
    <div
      className={cx(
        'p-[6px] rounded-[10px] cursor-pointer hover:opacity-80',
        props.active ? 'bg-[#5E95FC]' : 'bg-[#F2F2F2] bg-opacity-20',
      )}
    >
      <img src={props.icon} className="w-6 h-6" />
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="flex flex-col pr-5">
      <div className="flex flex-col gap-3 text-white font-medium text-sm">
        <div className="encadrePhilosophe">
        <div className="nomPhilosophe">Socrate</div>
        <div className="renseignements">Grèce<br />De -470 à -399</div>
        </div>
        <div>Demandez-moi...</div>
        <a className="rounded-[10px] boutons w-full h-[45px] pl-5 flex flex-col justify-center bg-[#F2F2F2] bg-opacity-20"><span className="text-white font-medium text-sm">Hello</span></a>
        <NavLink to="/chat/$botId" params={{ botId: 'chatgpt' }} text="Comment je suis mort" />
        <NavLink to="/chat/$botId" params={{ botId: 'chatgpt' }} text="Comment je philosophe" />
        <NavLink to="/chat/$botId" params={{ botId: 'chatgpt' }} text="Quelle est ma devise" />
      </div>
    </aside>
  )
}

export default Sidebar

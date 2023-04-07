import { Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import Sidebar from './Sidebar'
import { BotId } from '../bots'
import SingleBotChatPanel from '../pages/SingleBotChatPanel'

function doNothing() {}

function Layout() {
  const [value, setValue] = useState('Top of the world !')

  return (
    <div className="bg-[#76777f] h-screen py-3 px-3">
      <main className="grid grid-cols-[min(20%,250px)_1fr] h-full bg-[#ffffff66] rounded-[40px] max-w-[1400px] mx-auto backdrop-blur-2xl pl-5 py-4 pr-4">
        <div><Sidebar setValue={setValue}/></div>
        <Outlet />
        <SingleBotChatPanel botId={"chatgpt" as BotId} inputValue={value} setValue={setValue} />
      </main>
      
    </div>

  )
}

export default Layout

import { createHashHistory, createBrowserHistory, ReactRouter, RootRoute, Route, useParams } from '@tanstack/react-router'
import { BotId } from './bots'
import { useState } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import { Outlet } from '@tanstack/react-router'

import SingleBotChatPanel from './pages/SingleBotChatPanel'


//const [value, setValue] = useState('Top of the world !')


const rootRoute = new RootRoute()

/*const layoutRouteIndex = new Route({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})
/*
const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: ChatRoute,
})


function doNothing() {

}

function ChatRoute() {
  const { Id } = useParams({ from: chatRoute.id })
  return (<>
  <div><Sidebar setValue={setValue}/></div>
        <Outlet />
  <SingleBotChatPanel botId={"chatgpt" as BotId} Id={Id as string} inputValue={value} setValue={setValue} />
  </>)
}

const chatRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'chat/$Id',
  component: ChatRoute,
})
*/

function LayoutRouteIndex() {
  return (<Layout id={2 as number} />)
}

const layoutRouteIndex = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LayoutRouteIndex,
})

function LayoutChatRoute() {
  const { id } = useParams({ from: layoutChatRoute.id })
  let numId = Number(id)
  return (<Layout id={numId as number} />)
}

const layoutChatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'id/$id',
  component: LayoutChatRoute,
})

//const routeTree = rootRoute.addChildren([layoutRoute.addChildren([indexRoute, chatRoute, settingRoute])])
const routeTree = rootRoute.addChildren([layoutRouteIndex, layoutChatRoute])
/*
const routeTree = (
  <Layout id={'layout'}>
  <ChatRoute /><ChatRoute path={'chat/$botId'} />
  </Layout>
)*/

const hashHistory = createHashHistory()
const router = new ReactRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }

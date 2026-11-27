import { createBrowserRouter, Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { AppShell, adminPages, Brand, Controls, MobileBrandHeader, userPages } from '../../components/layout/AppShell'
import { Dashboard } from '../../features/dashboard/Dashboard'
import { LandingPage } from '../../features/landing/LandingPage'
import { usePreferences } from '../providers/Preferences'
import type { MessageKey } from '../../locales/messages'

function PublicShell() { return <div className="public-shell"><header className="public-toolbar"><Brand/><Controls/></header><MobileBrandHeader/><main><Outlet/></main></div> }
function Placeholder({ page, auth = false }: Readonly<{ page: MessageKey; auth?: boolean }>) {
  const { t } = usePreferences()
  const { pathname } = useLocation()
  const parent = pathname.startsWith('/app/') ? '/app/dashboard' : pathname.startsWith('/admin/') ? '/admin/dashboard' : '/'
  const back = parent === '/admin/dashboard' && pathname === parent ? '/app/dashboard' : parent

  return <section className="intro placeholder-page">
    <span className="placeholder-icon"><Compass size={23} aria-hidden="true"/></span>
    <h1>{t(page)}</h1>
    <div className="glass placeholder">
      <p>{t(auth ? 'authPending' : 'placeholder')}</p>
      <Link to={back}><ArrowLeft size={17} aria-hidden="true"/>{t(back === '/' ? 'home' : 'dashboard')}</Link>
    </div>
  </section>
}
export const routes = [
  { path: '/', element: <LandingPage/> },
  { element: <PublicShell/>, children: [{ path: '/login', element: <Placeholder page="login" auth/> }, { path: '/register', element: <Placeholder page="register" auth/> }, { path: '*', element: <Placeholder page="notFound"/> }] },
  { path: '/app', element: <AppShell/>, children: [{ index: true, element: <Dashboard/> }, ...userPages.map(page => ({ path: page, element: page === 'dashboard' ? <Dashboard/> : <Placeholder page={page}/> }))] },
  { path: '/admin', element: <AppShell/>, children: [{ index: true, element: <Placeholder page="admin"/> }, ...adminPages.map(page => ({ path: page, element: <Placeholder page={page}/> }))] },
]
export function makeRouter() { return createBrowserRouter(routes) }

import { createBrowserRouter, Link, Outlet } from 'react-router-dom'
import { AppShell, adminPages, Brand, Controls, userPages } from '../../components/layout/AppShell'
import { Dashboard } from '../../features/dashboard/Dashboard'
import { usePreferences } from '../providers/Preferences'
import type { MessageKey } from '../../locales/messages'

function PublicShell() { return <div className="public-shell"><header><Brand/><Controls/></header><main><Outlet/></main></div> }
function Landing() { const { t } = usePreferences(); return <section className="landing glass"><span className="eyebrow">{t('foundation')}</span><h1>{t('welcome')}</h1><p>{t('intro')}</p><Link className="primary-button" to="/app/dashboard">{t('open')} ↗</Link><div className="public-links"><Link to="/login">{t('login')}</Link><Link to="/register">{t('register')}</Link></div></section> }
function Placeholder({ page, auth = false }: { page: MessageKey; auth?: boolean }) { const { t } = usePreferences(); return <section className="intro"><span className="eyebrow">ARAH / {t('foundation')}</span><h1>{t(page)}</h1><div className="glass placeholder"><p>{t(auth ? 'authPending' : 'placeholder')}</p></div></section> }
export const routes = [
  { element: <PublicShell/>, children: [{ path: '/', element: <Landing/> }, { path: '/login', element: <Placeholder page="login" auth/> }, { path: '/register', element: <Placeholder page="register" auth/> }, { path: '*', element: <Placeholder page="notFound"/> }] },
  { path: '/app', element: <AppShell/>, children: [{ index: true, element: <Dashboard/> }, ...userPages.map(page => ({ path: page, element: page === 'dashboard' ? <Dashboard/> : <Placeholder page={page}/> }))] },
  { path: '/admin', element: <AppShell/>, children: [{ index: true, element: <Placeholder page="admin"/> }, ...adminPages.map(page => ({ path: page, element: <Placeholder page={page}/> }))] },
]
export function makeRouter() { return createBrowserRouter(routes) }

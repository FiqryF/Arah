import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { Leaf, Moon, Sun, LayoutDashboard, ListTodo, Heart, Bed, Utensils, Package, Compass, ChartNoAxesCombined, Settings, Users, BookOpen, Carrot, Coins } from 'lucide-react'
import { usePreferences } from '../../app/providers/Preferences'
import type { MessageKey } from '../../locales/messages'

export const userPages: MessageKey[] = ['dashboard', 'tasks', 'pulih', 'rest', 'nourish', 'pantry', 'assistant', 'reports', 'settings']
export const adminPages: MessageKey[] = ['dashboard', 'users', 'recipes', 'ingredients', 'prices']
const icons = { dashboard: LayoutDashboard, tasks: ListTodo, pulih: Heart, rest: Bed, nourish: Utensils, pantry: Package, assistant: Compass, reports: ChartNoAxesCombined, settings: Settings, users: Users, recipes: BookOpen, ingredients: Carrot, prices: Coins }
export function Controls() {
  const { theme, setTheme, language, setLanguage, t } = usePreferences()
  return <div className="controls"><button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`${t('theme')}: ${t(theme)}`} aria-pressed={theme === 'dark'}>{theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}<span>{t(theme)}</span></button><label><span className="sr-only">{t('language')}</span><select value={language} onChange={event => setLanguage(event.target.value as 'id' | 'en')}><option value="id">Indonesia</option><option value="en">English</option></select></label></div>
}
export function Brand() { return <Link to="/" className="brand"><Leaf aria-hidden="true"/><span>ARAH<small>Stay Productive, Stay Human</small></span></Link> }
export function AppShell() {
  const admin = useLocation().pathname.startsWith('/admin')
  const { t } = usePreferences()
  const pages = admin ? adminPages : userPages
  const prefix = admin ? '/admin/' : '/app/'
  return <div className="app-shell"><a className="skip-link" href="#main">{t('skip')}</a><aside className="sidebar"><Brand/><p className="eyebrow">{admin ? t('admin') : 'Adaptive Recovery & Achievement Hub'}</p><nav aria-label={admin ? t('admin') : 'ARAH'}>{pages.map(page => { const Icon = icons[page as keyof typeof icons]; return <NavLink to={prefix + page} key={page}><Icon size={19}/>{t(page)}</NavLink> })}</nav><Link className="subtle-link" to={admin ? '/app/dashboard' : '/admin/dashboard'}>{admin ? t('dashboard') : t('admin')} ↗</Link></aside><div className="workspace"><header className="topbar"><span className="eyebrow">{t('foundation')}</span><Controls/></header><main id="main" tabIndex={-1}><p className="preview-note">{t('preview')}</p><Outlet/></main><footer>ARAH · TECHCOMFEST 2027</footer></div><nav className="bottom-nav" aria-label="Mobile">{pages.slice(0, 4).map(page => { const Icon = icons[page as keyof typeof icons]; return <NavLink key={page} to={prefix + page}><Icon size={20}/><span>{t(page)}</span></NavLink> })}<NavLink to={prefix + (admin ? 'prices' : 'settings')}><Settings size={20}/><span>{t(admin ? 'prices' : 'settings')}</span></NavLink></nav></div>
}

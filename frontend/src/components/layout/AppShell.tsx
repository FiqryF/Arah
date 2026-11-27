import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
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
export function MobileBrandHeader({ href = '/' }: Readonly<{ href?: string }>) {
  const mark = <><span className="mobile-brand-mark"><Leaf size={19} aria-hidden="true"/></span><span>ARAH</span></>
  return <header className="mobile-brand-header">
    {href.startsWith('#') ? <a href={href}>{mark}</a> : <Link to={href}>{mark}</Link>}
  </header>
}
export function CapsuleNavigation({ activePage, label, className = '', children }: Readonly<{ activePage?: string; label: string; className?: string; children: ReactNode }>) {
  const { language } = usePreferences()
  const navRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const indicatorAnimation = useRef<Animation | null>(null)
  const positioned = useRef(false)
  const targetGeometry = useRef({ x: 0, width: 0 })
  const positions = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    const nav = navRef.current
    const indicator = indicatorRef.current
    if (!nav || !indicator) return
    function updatePosition() {
      if (!nav || !indicator) return
      const active = nav.querySelector<HTMLElement>('a.active')
      if (!active || nav.offsetWidth === 0) {
        indicator.style.opacity = '0'
        positioned.current = false
        positions.current.clear()
        return
      }
      const previous = indicator.getBoundingClientRect()
      const container = nav.getBoundingClientRect()
      const x = active.offsetLeft
      const width = active.offsetWidth
      if (positioned.current && targetGeometry.current.x === x && targetGeometry.current.width === width) return
      targetGeometry.current = { x, width }
      const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
      const animate = positioned.current && !reducedMotion && typeof indicator.animate === 'function'
      indicatorAnimation.current?.cancel()
      indicator.style.width = `${width}px`
      indicator.style.transform = `translateX(${x}px)`
      indicator.style.opacity = '1'
      if (animate && (Math.abs(previous.left - container.left - nav.clientLeft - x) > .5 || Math.abs(previous.width - width) > .5)) {
        const oldX = previous.left - container.left - nav.clientLeft
        const oldCenter = oldX + previous.width / 2
        const collapsedWidth = width * .12
        indicatorAnimation.current = indicator.animate([
          { offset: 0, transform: `translateX(${oldX}px) scaleX(${previous.width / width})`, opacity: 1 },
          { offset: .45, transform: `translateX(${oldCenter - collapsedWidth / 2}px) scaleX(.12)`, opacity: 0 },
          { offset: .46, transform: `translateX(${x + (width - collapsedWidth) / 2}px) scaleX(.12)`, opacity: 0 },
          { offset: 1, transform: `translateX(${x}px) scaleX(1)`, opacity: 1 },
        ], { duration: 340, easing: 'ease-in-out' })
      }
      nav.querySelectorAll<HTMLAnchorElement>('a').forEach(link => {
        const destination = link.pathname + link.hash
        const oldX = positions.current.get(destination)
        const transform = getComputedStyle(link).transform
        const translation = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41
        const delta = oldX === undefined ? 0 : oldX + translation - link.offsetLeft
        link.getAnimations?.().forEach(animation => animation.cancel())
        if (animate && Math.abs(delta) > .5) {
          link.animate([{ transform: `translateX(${delta}px)` }, { transform: 'translateX(0)' }],
            { duration: 260, easing: 'cubic-bezier(.4, 0, .2, 1)' })
        }
        positions.current.set(destination, link.offsetLeft)
      })
      positioned.current = true
    }
    updatePosition()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updatePosition)
    observer?.observe(nav)
    const active = nav.querySelector('a.active')
    if (active) observer?.observe(active)
    return () => observer?.disconnect()
  }, [activePage, language])

  return <nav ref={navRef} className={`bottom-nav ${className}`} aria-label={label}>
    <span ref={indicatorRef} className="bottom-nav__indicator" data-tone={activePage} aria-hidden="true"/>
    {children}
  </nav>
}

function MobileNavigation({ pages, prefix }: Readonly<{ pages: MessageKey[]; prefix: string }>) {
  const { t } = usePreferences()
  const { pathname } = useLocation()
  const activePage = pages.find(page => pathname.replace(/\/$/, '') === prefix + page)

  return <CapsuleNavigation activePage={activePage} label={t('mobileNavigation')}>
    {pages.map(page => {
      const Icon = icons[page as keyof typeof icons]
      return <NavLink className="bottom-nav__item" key={page} to={prefix + page} data-tone={page} aria-label={t(page)} title={t(page)}>
        <Icon size={21} strokeWidth={1.8} aria-hidden="true"/>
        <span className="bottom-nav__label" aria-hidden="true">{t(page)}</span>
      </NavLink>
    })}
  </CapsuleNavigation>
}
export function AppShell() {
  const admin = useLocation().pathname.startsWith('/admin')
  const { t } = usePreferences()
  const pages = admin ? adminPages : userPages
  const prefix = admin ? '/admin/' : '/app/'
  const mobilePages: MessageKey[] = admin ? pages : [...pages.slice(0, 4), 'settings']
  return <div className="app-shell">
    <a className="skip-link" href="#main">{t('skip')}</a>
    <aside className="sidebar">
      <Brand/>
      <p className="eyebrow">{admin ? t('admin') : 'Adaptive Recovery & Achievement Hub'}</p>
      <nav aria-label={admin ? t('admin') : 'ARAH'}>{pages.map(page => {
        const Icon = icons[page as keyof typeof icons]
        return <NavLink to={prefix + page} key={page}><Icon size={19} aria-hidden="true"/>{t(page)}</NavLink>
      })}</nav>
      <Link className="subtle-link" to={admin ? '/app/dashboard' : '/admin/dashboard'}>{admin ? t('dashboard') : t('admin')} ↗</Link>
    </aside>
    <div className="workspace">
      <MobileBrandHeader/>
      <div className="topbar"><span className="workspace-caption">{admin ? t('admin') : 'Adaptive Recovery & Achievement Hub'}</span><Controls/></div>
      <main id="main" tabIndex={-1}><p className="preview-note">{t('preview')}</p><Outlet/></main>
      <footer>ARAH · TECHCOMFEST 2027</footer>
    </div>
    <MobileNavigation pages={mobilePages} prefix={prefix}/>
  </div>
}

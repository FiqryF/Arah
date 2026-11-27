import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, BatteryMedium, ChartNoAxesCombined, Compass, Heart, House, Layers3, Leaf, ListTodo, LogIn, Moon, Package, ShieldCheck, SlidersHorizontal, Utensils } from 'lucide-react'
import { CapsuleNavigation, Controls, MobileBrandHeader } from '../../components/layout/AppShell'
import { usePreferences } from '../../app/providers/Preferences'
import { landing, type LandingCopy } from './content'
import './landing.css'

const anchors = ['home', 'features', 'how-it-works', 'about']
const icons = [ListTodo, Heart, Moon, Utensils, BatteryMedium, Compass, Package, ChartNoAxesCombined]

function LandingNav({ copy, login }: Readonly<{ copy: LandingCopy; login: string }>) {
  const { t } = usePreferences()
  const [current, setCurrent] = useState('home')
  const [dockActive, setDockActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const dock = [
    { anchor: 'home', label: copy.nav[0], icon: House },
    { anchor: 'features', label: copy.moduleNav, icon: Layers3 },
    { anchor: 'preferences', label: t('settings'), icon: SlidersHorizontal },
  ]
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
      if (visible.length) setCurrent(visible[0].target.id)
    }, { rootMargin: '-92px 0px -120px 0px' })
    ;anchors.forEach(id => { const node = document.getElementById(id); if (node) observer.observe(node) })
    const hero = document.querySelector('.landing-hero')
    const glass = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    if (hero) glass.observe(hero)
    return () => { observer.disconnect(); glass.disconnect() }
  }, [])
  const links = copy.nav.map((label, index) => <a key={anchors[index]} href={`#${anchors[index]}`} aria-current={current === anchors[index] ? 'location' : undefined} onClick={() => setCurrent(anchors[index])}>{label}</a>)
  useEffect(() => {
    function syncDock() {
      const anchor = window.location.hash.slice(1)
      if (anchor === 'preferences' || anchor === 'home') setDockActive(anchor)
      else setDockActive(anchor ? 'features' : 'home')
    }
    syncDock()
    window.addEventListener('hashchange', syncDock)
    return () => window.removeEventListener('hashchange', syncDock)
  }, [])
  return <><MobileBrandHeader href="#home"/><header className="landing-nav landing-glass" data-scrolled={scrolled}>
    <a className="landing-brand" href="#home"><span><Leaf size={19}/></span>ARAH</a>
    <nav className="landing-desktop" aria-label={copy.menu}>{links}</nav>
    <div className="landing-nav-actions"><div className="landing-desktop"><Controls/></div><Link className="landing-login" to="/login">{login}</Link><Link className="landing-button landing-nav-start" to="/register">{copy.primary}<ArrowRight size={16}/></Link></div>
  </header>
  <CapsuleNavigation className="landing-dock" label={t('mobileNavigation')} activePage={dockActive}>
    {dock.map(({ label, anchor, icon: Icon }) => {
      const active = dockActive === anchor
      return <a key={anchor} href={`#${anchor}`} className={`bottom-nav__item${active ? ' active' : ''}`} aria-label={label} title={label} aria-current={active ? 'location' : undefined} onClick={() => setDockActive(anchor)}>
        <Icon size={21} strokeWidth={1.8} aria-hidden="true"/><span className="bottom-nav__label" aria-hidden="true">{label}</span>
      </a>
    })}
    <Link to="/login" className="bottom-nav__item" aria-label={login} title={login}><LogIn size={21} strokeWidth={1.8} aria-hidden="true"/><span className="bottom-nav__label" aria-hidden="true">{login}</span></Link>
  </CapsuleNavigation></>
}

function Hero({ copy }: Readonly<{ copy: LandingCopy }>) {
  const [failed, setFailed] = useState(false)
  return <section id="home" className="landing-hero">
    <div className="landing-hero-media">
      {!failed && <img src="/images/landing/forest-lake-1920.webp" srcSet="/images/landing/forest-lake-960.webp 960w, /images/landing/forest-lake-1920.webp 1920w" sizes="100vw" width="1920" height="1440" fetchPriority="high" alt={copy.photo} onError={() => setFailed(true)}/>}
      <div className="landing-photo-fallback" role={failed ? 'img' : undefined} aria-label={failed ? copy.photo : undefined}/>
    </div>
    <div className="landing-hero-copy">
      <p className="landing-eyebrow">{copy.eyebrow}</p>
      <h1>Stay Productive,<br/><em>Stay Human.</em></h1>
      <p className="landing-lead">{copy.hero}</p>
      <div className="landing-actions"><Link className="landing-button" to="/register">{copy.primary}<ArrowRight size={18}/></Link><a className="landing-button landing-button-glass" href="#features">{copy.explore}<ArrowDown size={17}/></a></div>
    </div>
    <div className="landing-hero-index" aria-label={copy.nav[1]}>{copy.benefits.map(([label], index) => {
      const Icon = icons[index]
      return <a key={label} href={`#arah-module-${index}`}><Icon size={18} aria-hidden="true"/>{label}</a>
    })}</div>
  </section>
}

function Features({ copy }: Readonly<{ copy: LandingCopy }>) {
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    function readModuleHash() {
      const match = /^#arah-module-([0-7])$/.exec(window.location.hash)
      if (match) setSelected(Number(match[1]))
    }
    readModuleHash()
    window.addEventListener('hashchange', readModuleHash)
    return () => window.removeEventListener('hashchange', readModuleHash)
  }, [])
  useEffect(() => {
    const id = `arah-module-${selected}`
    if (window.location.hash === `#${id}`) document.getElementById(id)?.scrollIntoView?.({ block: 'nearest' })
  }, [selected])
  return <>
    <section className="landing-wrap landing-intro" data-reveal><h2>{copy.intro}</h2><p>{copy.introText}</p></section>
    <section id="features" className="landing-wrap landing-section"><h2 data-reveal>{copy.features}</h2>
      <p className="module-picker-heading">{copy.pickerHint}</p>
      <div className="module-picker landing-glass" role="group" aria-label={copy.moduleNav}>{copy.modules.map(([name], index) => {
        const Icon = icons[index]
        return <button key={name} type="button" aria-label={name} aria-pressed={index === selected} aria-controls={`arah-module-${index}`} data-module-tone={index} onClick={() => setSelected(index)}><Icon size={18} aria-hidden="true"/>{copy.moduleNames[index]}</button>
      })}</div>
      <div className="landing-modules" data-stagger>{copy.modules.map(([name, title, description], index) => {
      const Icon = icons[index]
      return <article className="landing-module" id={`arah-module-${index}`} data-module-tone={index} data-selected={index === selected} data-reveal key={name}>
        <div className="landing-module-title"><Icon size={18} aria-hidden="true"/><p className="landing-module-name">{name}</p></div>
        <h3>{title}</h3><p>{description}</p>
      </article>
    })}</div></section>
    <section className="landing-wrap landing-section"><h2 data-reveal>{copy.benefitsTitle}</h2><div className="landing-benefits" data-stagger>{copy.benefits.map(([title, description], index) => {
      const Icon = icons[index]
      return <article key={title} data-reveal><Icon size={25}/><h3>{title}</h3><p>{description}</p></article>
    })}</div></section>
  </>
}

export function LandingPage() {
  const { language, t } = usePreferences()
  const copy = landing[language]
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!root.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target) }
    }), { threshold: .13 })
    root.current.querySelectorAll('[data-reveal]').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  return <div className="landing-page" ref={root}>
    <a className="skip-link" href="#landing-main">{t('skip')}</a>
    <LandingNav copy={copy} login={t('login')}/>
    <main id="landing-main" tabIndex={-1}>
      <Hero copy={copy}/><Features copy={copy}/>
      <section id="how-it-works" className="landing-wrap landing-section"><h2 data-reveal>{copy.how}</h2><ol className="landing-steps" data-stagger>{copy.steps.map(([title, description]) => <li data-reveal key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol></section>
      <div id="about" className="landing-wrap landing-section landing-about" data-reveal><section><h2>{copy.why}</h2><p>{copy.whyText}</p></section><section className="landing-privacy landing-glass"><ShieldCheck size={26}/><h2>{copy.trust}</h2><p>{copy.trustText}</p></section></div>
      <section className="landing-final" data-reveal><div className="landing-wrap"><h2>{copy.final}</h2><p>{copy.finalText}</p><div className="landing-actions"><Link className="landing-button" to="/register">{copy.primary}<ArrowRight size={18}/></Link><Link className="landing-button landing-button-glass" to="/login">{t('login')}</Link></div></div></section>
    </main>
    <footer className="landing-wrap landing-footer" id="preferences"><div><a className="landing-brand" href="#home"><span><Leaf size={19}/></span>ARAH</a><p>Stay Productive, Stay Human.</p><p>{copy.footer}</p></div><nav aria-label={copy.menu}><a href="#features">{copy.nav[1]}</a><a href="#about">{copy.nav[3]}</a><Link to="/login">{t('login')}</Link><Link to="/register">{copy.primary}</Link></nav><Controls/><small>© {new Date().getFullYear()} ARAH</small></footer>
  </div>
}

import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { usePreferences } from '../../app/providers/Preferences'
import { ConnectionStatus } from '../../components/ui/ConnectionStatus'

export function Dashboard() {
  const { t } = usePreferences()
  return <><section className="intro"><span className="eyebrow">ARAH / {t('dashboard')}</span><h1>{t('welcome')}</h1><p>{t('intro')}</p></section><div className="dashboard-grid"><section className="glass module-list"><h2>{t('dashboard')}</h2>{(['tasks', 'pulih', 'rest', 'nourish', 'pantry', 'assistant', 'reports'] as const).map(key => <Link className="module-row" to={`/app/${key}`} key={key}><span>{t(key)}</span><ArrowUpRight size={19}/></Link>)}</section><div><ConnectionStatus/><section className="glass quiet-note"><p>{t('placeholder')}</p></section></div></div></>
}

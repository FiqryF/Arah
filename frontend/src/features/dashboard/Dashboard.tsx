import { Link } from 'react-router-dom'
import { ArrowUpRight, ChartNoAxesCombined, Compass, Heart, ListTodo, Moon, Package, Utensils } from 'lucide-react'
import { usePreferences } from '../../app/providers/Preferences'
import { ConnectionStatus } from '../../components/ui/ConnectionStatus'
import { landing } from '../landing/content'

const dashboardModules = [
  { key: 'tasks', icon: ListTodo, example: 0 },
  { key: 'pulih', icon: Heart, example: 1 },
  { key: 'rest', icon: Moon, example: 2 },
  { key: 'nourish', icon: Utensils, example: 3 },
  { key: 'pantry', icon: Package, example: 6 },
  { key: 'assistant', icon: Compass, example: 5 },
  { key: 'reports', icon: ChartNoAxesCombined, example: 7 },
] as const

export function Dashboard() {
  const { t, language } = usePreferences()
  return <div className="dashboard-main">
    <section className="intro dashboard-intro"><h1>{t('welcome')}</h1><p>{t('intro')}</p></section>
    <div className="dashboard-grid">
      <section className="glass module-list"><h2>{t('modules')}</h2>{dashboardModules.map(({ key, icon: Icon, example }) => (
        <Link className="module-row" data-module-tone={example} to={`/app/${key}`} key={key}>
          <span><Icon size={17} aria-hidden="true"/></span><span><strong>{t(key)}</strong><small>{landing[language].modules[example][1]}</small></span><ArrowUpRight size={17} aria-hidden="true"/>
        </Link>
      ))}</section>
      <ConnectionStatus/>
    </div>
  </div>
}

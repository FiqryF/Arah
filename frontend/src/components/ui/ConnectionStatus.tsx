import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { checkHealth } from '../../lib/api'
import { usePreferences } from '../../app/providers/Preferences'

type Status = 'checking' | 'connected' | 'disconnected'
export function ConnectionStatus() {
  const { t } = usePreferences()
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<[Status, Status]>(['checking', 'checking'])
  useEffect(() => {
    const controller = new AbortController()
    setStatus(['checking', 'checking'])
    for (const [index, database] of [false, true].entries()) {
      checkHealth(database, controller.signal).then(() => update('connected')).catch(() => update('disconnected'))
      function update(value: Status) {
        if (!controller.signal.aborted) setStatus(previous => index === 0 ? [value, previous[1]] : [previous[0], value])
      }
    }
    return () => controller.abort()
  }, [attempt])
  return <section className="glass connection" aria-label={t('connection')}>
    <div className="section-heading"><h2>{t('connection')}</h2><button className="icon-button" onClick={() => setAttempt(value => value + 1)} aria-label={t('retry')}><RefreshCw size={18}/></button></div>
    <div role="status" aria-live="polite">{['API', 'PostgreSQL'].map((label, i) => <p className="status-row" key={label}><span>{label}</span><span><i className={`dot ${status[i]}`}/>{t(status[i])}</span></p>)}</div>
  </section>
}

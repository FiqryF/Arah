import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { messages, type MessageKey } from '../../locales/messages'

type Theme = 'light' | 'dark'
type Language = 'id' | 'en'
export const DEFAULT_USER_TIMEZONE = 'Asia/Jakarta' as const
function read(key: string) { try { return localStorage.getItem(key) } catch { return null } }
function save(key: string, value: string) { try { localStorage.setItem(key, value) } catch { /* Preferences remain usable without storage. */ } }
const Context = createContext<{
  theme: Theme; setTheme: (value: Theme) => void
  language: Language; setLanguage: (value: Language) => void
  timezone: typeof DEFAULT_USER_TIMEZONE
  t: (key: MessageKey) => string
} | null>(null)

export function Preferences({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => read('arah-theme') === 'dark' ? 'dark' : 'light')
  const [language, setLanguage] = useState<Language>(() => read('arah-language') === 'en' ? 'en' : 'id')
  useEffect(() => { document.documentElement.dataset.theme = theme; save('arah-theme', theme) }, [theme])
  useEffect(() => { document.documentElement.lang = language; save('arah-language', language) }, [language])
  return <Context.Provider value={{ theme, setTheme, language, setLanguage, timezone: DEFAULT_USER_TIMEZONE, t: key => messages[language][key] }}>{children}</Context.Provider>
}
export function usePreferences() {
  const value = useContext(Context)
  if (!value) throw new Error('Preferences provider missing')
  return value
}

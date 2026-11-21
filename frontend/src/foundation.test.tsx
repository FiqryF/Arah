import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, expect, test, vi } from 'vitest'
import { Preferences, usePreferences } from './app/providers/Preferences'
import { routes } from './app/router/routes'
import { checkHealth } from './lib/api'

beforeEach(() => vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, json: async () => url.endsWith('/db') ? { status: 'ok', database: 'connected' } : { status: 'ok', service: 'ARAH API' } }))))
function open(path = '/app/dashboard') { return render(<Preferences><RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })}/></Preferences>) }
test('mobile navigation keeps ARAH destinations and updates its active link and translated names', async () => {
  open()
  const user = userEvent.setup()
  const navigation = screen.getByRole('navigation', { name: 'Navigasi utama' })
  expect(within(navigation).getAllByRole('link')).toHaveLength(5)
  expect(within(navigation).getByRole('link', { name: 'Beranda' })).toHaveAttribute('aria-current', 'page')
  await user.click(within(navigation).getByRole('link', { name: 'Rencana tugas' }))
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Rencana tugas')
  expect(within(navigation).getByRole('link', { name: 'Rencana tugas' })).toHaveAttribute('aria-current', 'page')
  expect(within(navigation).getByRole('link', { name: 'Beranda' })).not.toHaveAttribute('aria-current')
  await user.click(within(navigation).getByRole('link', { name: 'Pengaturan' }))
  await user.selectOptions(screen.getByRole('combobox', { name: 'Bahasa' }), 'en')
  expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  expect(within(navigation).getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page')
})
test('preference context remains stable when its parent rerenders without preference changes', () => {
  let captured: ReturnType<typeof usePreferences> | undefined
  function Probe() { captured = usePreferences(); return null }
  const view = render(<Preferences><Probe/></Preferences>)
  const initialValue = captured
  expect(initialValue).toBeDefined()
  view.rerender(<Preferences><Probe/></Preferences>)
  expect(captured).toBe(initialValue)
})
test('user timezone is Jakarta and a UTC instant crosses midnight correctly', () => {
  function Probe() {
    const { timezone } = usePreferences()
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date('2026-11-21T18:30:00Z'))
    return <output>{timezone}: {parts}</output>
  }
  render(<Preferences><Probe/></Preferences>)
  expect(screen.getByRole('status')).toHaveTextContent('Asia/Jakarta: 22/11/2026, 01:30')
})
test('dashboard renders real API and database check results', async () => {
  open()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ruang untuk maju')
  await waitFor(() => expect(screen.getAllByText('Terhubung')).toHaveLength(2))
  expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/v1/health/db', expect.any(Object))
})
test('theme and language switch and persist across remount', async () => {
  const user = userEvent.setup(); const view = open()
  await user.click(screen.getByRole('button', { name: 'Tema: Terang' }))
  expect(document.documentElement.dataset.theme).toBe('dark')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Bahasa' }), 'en')
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Room to grow')
  expect(document.documentElement.lang).toBe('en')
  view.unmount(); open()
  expect(screen.getByRole('button', { name: 'Theme: Dark' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Room to grow')
})
test('unreachable API is displayed honestly and retry recovers', async () => {
  vi.mocked(fetch).mockRejectedValue(new Error('offline')); open()
  await waitFor(() => expect(screen.getAllByText('Tidak tersedia')).toHaveLength(2))
  vi.mocked(fetch).mockImplementation(async (input) => new Response(JSON.stringify(String(input).endsWith('/db') ? { status: 'ok', database: 'connected' } : { status: 'ok', service: 'ARAH API' })))
  await userEvent.click(screen.getByRole('button', { name: 'Periksa ulang' }))
  await waitFor(() => expect(screen.getAllByText('Terhubung')).toHaveLength(2))
})
test('non-success and malformed responses are rejected', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 503 }))
  await expect(checkHealth(true)).rejects.toThrow('503')
  vi.mocked(fetch).mockResolvedValueOnce(new Response('{"status":"ok"}'))
  await expect(checkHealth(false)).rejects.toThrow('Unexpected')
})
const paths = ['/', '/login', '/register', ...['dashboard','tasks','pulih','rest','nourish','pantry','assistant','reports','settings'].map(page => `/app/${page}`), ...['dashboard','users','recipes','ingredients','prices'].map(page => `/admin/${page}`), '/unknown']
test.each(paths)('route %s renders with an accessible heading', path => { open(path); expect(screen.getByRole('heading', { level: 1 })).toBeVisible() })

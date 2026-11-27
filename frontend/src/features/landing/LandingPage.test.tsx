import { fireEvent, render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { expect, test } from 'vitest'
import { Preferences } from '../../app/providers/Preferences'
import { routes } from '../../app/router/routes'

function mountLanding() {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] })
  render(<Preferences><RouterProvider router={router}/></Preferences>)
  return router
}

test('landing includes all modules and opens registration from its hero', async () => {
  const router = mountLanding()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stay Productive,Stay Human.')
  const features = document.getElementById('features')!
  expect(within(features).getAllByRole('article')).toHaveLength(8)
  expect(screen.getByRole('link', { name: 'Jelajahi Fitur' })).toHaveAttribute('href', '#features')
  fireEvent.click(screen.getAllByRole('link', { name: 'Mulai Sekarang' }).find(link => link.closest('#home'))!)
  expect(await screen.findByRole('heading', { level: 1, name: 'Daftar' })).toBeVisible()
  expect(router.state.location.pathname).toBe('/register')
})

test('hero image has an accessible fallback and landing no longer exposes a demo', () => {
  mountLanding()
  expect(document.querySelector('#demo, .landing-example, a[href="#demo"]')).toBeNull()
  const photo = screen.getByRole('img', { name: /danau tenang/i })
  fireEvent.error(photo)
  expect(screen.getByRole('img', { name: /danau tenang/i }).tagName).toBe('DIV')
})

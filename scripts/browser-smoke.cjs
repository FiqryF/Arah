// Run after starting Vite, FastAPI, and migrated PostgreSQL; see README.
const { chromium } = require('../.tools/browser/node_modules/playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const evidence = path.join(__dirname, '../docs/reports/evidence')

;(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
  const errors = []
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  fs.mkdirSync(evidence, { recursive: true })
  try {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('http://localhost:5173/app/dashboard')
      await page.getByText('Terhubung', { exact: true }).nth(1).waitFor()
      assert.equal(await page.getByText('Terhubung', { exact: true }).count(), 2)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      await page.screenshot({ path: path.join(evidence, `dashboard-${width}-light.png`), fullPage: true })
      await page.getByRole('button', { name: 'Tema: Terang' }).click()
      await page.getByRole('combobox', { name: 'Bahasa' }).selectOption('en')
      await page.getByRole('heading', { level: 1, name: 'Room to grow. Time to recover.' }).waitFor()
      await page.reload()
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
      assert.equal(await page.locator('html').getAttribute('lang'), 'en')
      await page.screenshot({ path: path.join(evidence, `dashboard-${width}-dark.png`), fullPage: true })
      // Reset for the next viewport.
      await page.evaluate(() => localStorage.clear())
    }
    const response = await page.request.get('http://localhost:8000/api/v1/health/db')
    assert.equal(response.status(), 200)
    assert.deepEqual(await response.json(), { status: 'ok', database: 'connected' })
    assert.equal((await page.request.get('http://localhost:8000/docs')).status(), 200)
    assert.deepEqual(errors, [])
    console.log('PASS: real API + PostgreSQL, Swagger, 390/1440px layout, themes, translations, persistence; no browser errors')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })

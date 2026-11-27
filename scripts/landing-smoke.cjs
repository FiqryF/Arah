const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')
const { createRequire } = require('node:module')
const { chromium } = createRequire(path.join(__dirname, '../.tools/browser/package.json'))('playwright')
const output = process.env.ARAH_LANDING_EVIDENCE || path.join(__dirname, '../docs/reports/evidence/phase-3-landing')
const base = process.env.ARAH_LANDING_URL || 'http://localhost:5173'

async function check(browser, width, theme, language) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    await page.addInitScript(({ theme, language }) => {
      localStorage.setItem('arah-theme', theme)
      localStorage.setItem('arah-language', language)
    }, { theme, language })
    await page.goto(base)
    await page.waitForFunction(() => document.querySelector('.landing-hero img')?.naturalWidth > 0)
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('html').getAttribute('lang'), language)
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
    assert.equal(await page.locator('#features article').count(), 8)
    assert.equal(await page.locator('#demo, .landing-example, a[href="#demo"]').count(), 0)
    if (width < 960) {
      const dock = page.locator('.landing-dock')
      assert.equal(await page.locator('.landing-nav').isVisible(), false)
      assert.equal(await page.locator('.mobile-brand-header').innerText(), 'ARAH')
      assert.equal(await dock.isVisible(), true)
      const dockPositions = () => dock.locator('a').evaluateAll(links => links.map(link => [link.offsetLeft, link.offsetWidth, link.offsetHeight]))
      const initialPositions = await dockPositions()
      assert.equal(initialPositions.length, 4)
      const featuresLink = dock.locator('a[href="#features"]')
      await featuresLink.focus()
      await page.keyboard.press('Enter')
      assert.equal(new URL(page.url()).hash, '#features')
      assert.equal(await featuresLink.getAttribute('aria-current'), 'location')
      assert.deepEqual(await dockPositions(), initialPositions)
      assert.equal(await page.locator('.landing-module:visible').count(), 1)
      const picker = page.locator('.module-picker')
      assert.equal(await picker.getByRole('button').count(), 8)
      assert.ok(await picker.evaluate(node => node.scrollWidth === node.clientWidth))
      const panelHeight = await page.locator('.landing-modules').evaluate(node => node.offsetHeight)
      const rest = picker.getByRole('button', { name: 'REST', exact: true })
      await rest.click()
      assert.equal(await rest.getAttribute('aria-pressed'), 'true')
      assert.equal(await page.locator('.landing-module:visible').getAttribute('data-module-tone'), '2')
      await picker.getByRole('button', { name: 'PULIH', exact: true }).click()
      assert.equal(await page.locator('.landing-modules').evaluate(node => node.offsetHeight), panelHeight)
    } else {
      assert.equal(await page.locator('.landing-dock').isVisible(), false)
      assert.equal(await page.locator('.landing-module:visible').count(), 8)
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    assert.equal(await page.locator('.landing-hero img').evaluate(node => getComputedStyle(node).animationName), 'none')
    assert.equal(await page.locator('.landing-hero img').evaluate(node => getComputedStyle(node).transform), 'none')
    await page.evaluate(() => scrollTo(0, 0))
    if ([390, 1440].includes(width)) {
      await page.screenshot({ path: path.join(output, `${width}-${theme}.png`), fullPage: true })
      if (theme === 'light') await page.locator('.landing-hero').screenshot({ path: path.join(output, `hero-${width}.png`), style: '.landing-nav { visibility: hidden; }' })
      if (width === 390) await page.locator('#features').screenshot({ path: path.join(output, `features-mobile-${theme}.png`), style: '.landing-dock { visibility: hidden; }' })
      if (width === 1440 && theme === 'light') {
        await page.locator('#features').screenshot({ path: path.join(output, 'features.png'), style: '.landing-nav { visibility: hidden; }' })
      }
    }
    assert.deepEqual(errors, [])
  } finally { await page.close() }
}

async function checkMotion(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  try {
    await page.addInitScript(() => {
      window.landingMetrics = {}
      for (const type of ['largest-contentful-paint', 'layout-shift']) {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (type === 'largest-contentful-paint') window.landingMetrics.lcp = entry.startTime
            else if (!entry.hadRecentInput) window.landingMetrics.cls = (window.landingMetrics.cls || 0) + entry.value
          }
        }).observe({ type, buffered: true })
      }
    })
    await page.goto(base)
    const image = page.locator('.landing-hero img')
    await page.waitForFunction(() => document.querySelector('.landing-hero img')?.naturalWidth > 0)
    await page.locator('.landing-hero-media').evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished)))
    const before = await image.evaluate(node => ({ transform: getComputedStyle(node).transform, height: document.documentElement.scrollHeight, size: [node.naturalWidth, node.naturalHeight] }))
    await page.evaluate(() => scrollTo(0, 630))
    await page.waitForFunction(transform => getComputedStyle(document.querySelector('.landing-hero img')).transform !== transform, before.transform)
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), before.height)
    await page.locator('#features h2').scrollIntoViewIfNeeded()
    await page.waitForFunction(() => document.querySelector('#features h2').classList.contains('is-revealed'))
    console.log('Local Chrome sample:', { ...await page.evaluate(() => window.landingMetrics), image: before.size })
    const locale = page.locator('.landing-nav .landing-desktop .controls select')
    await locale.selectOption('en')
    await page.locator('.landing-nav .landing-desktop .controls button').click()
    await page.reload()
    await page.waitForFunction(() => document.documentElement.lang === 'en' && document.documentElement.dataset.theme === 'dark')
    await page.locator('#home a[href="/register"]').click()
    await page.waitForURL('**/register')
  } finally { await page.close() }
}

;(async () => {
  fs.mkdirSync(output, { recursive: true })
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
  try {
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
      const results = await Promise.allSettled([check(browser, width, 'light', 'id'), check(browser, width, 'dark', 'en')])
      for (const result of results) if (result.status === 'rejected') throw result.reason
    }
    await checkMotion(browser)
    console.log('PASS: 20 viewport/theme/language scenarios, stable mobile capsule and module picker, demo removed, CTA, reduced motion, parallax and scroll reveal')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })

const assert = require('node:assert/strict')
const path = require('node:path')
const { createRequire } = require('node:module')
const requireBrowserTool = createRequire(path.join(__dirname, '../.tools/browser/package.json'))
const { chromium } = requireBrowserTool('playwright')
const evidence = path.join(__dirname, '../docs/reports/evidence')

async function checkNavigation(browser, scenario) {
  const context = await browser.newContext({ viewport: { width: scenario.width, height: 860 }, reducedMotion: 'reduce' })
  const errors = []
  try {
    await context.addInitScript(({ theme, language }) => {
      localStorage.setItem('arah-theme', theme)
      localStorage.setItem('arah-language', language)
    }, scenario)
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`http://localhost:5173${scenario.route}`)
    const nav = page.locator('.bottom-nav')
    if (scenario.width >= 900) {
      assert.equal(await nav.isVisible(), false)
      assert.equal(await page.locator('.sidebar').isVisible(), true)
    } else {
      await nav.waitFor({ state: 'visible' })
      assert.equal(await nav.getByRole('link').count(), 5)
      const active = nav.locator('a.active')
      assert.equal(await active.count(), 1)
      assert.equal(await active.getAttribute('aria-current'), 'page')
      assert.equal(await active.getAttribute('href'), scenario.route)
      const geometry = await nav.evaluate(element => {
        const box = element.getBoundingClientRect()
        return {
          left: box.left, right: box.right, bottom: box.bottom, radius: getComputedStyle(element).borderRadius,
          touches: [...element.querySelectorAll('a')].every(link => link.getBoundingClientRect().width >= 44 && link.getBoundingClientRect().height >= 44),
          equalInactive: [...element.querySelectorAll('a:not(.active)')].every(link => Math.abs(link.offsetWidth - element.querySelector('a:not(.active)').offsetWidth) < 1 && link.offsetHeight === 46),
          horizontal: getComputedStyle(element.querySelector('a.active')).flexDirection === 'row',
          visibleLabels: [...element.querySelectorAll('.bottom-nav__label')].filter(label => getComputedStyle(label).display !== 'none').length,
          reducedMotion: [...element.querySelectorAll('a')].every(link => getComputedStyle(link).transitionDuration === '0s'),
        }
      })
      assert.ok(geometry.left >= 10 && geometry.right <= scenario.width - 10)
      assert.ok(geometry.bottom <= 844)
      assert.equal(geometry.radius, '999px')
      assert.equal(geometry.touches, true)
      assert.equal(geometry.equalInactive, true)
      assert.equal(geometry.horizontal, true)
      assert.equal(geometry.visibleLabels, 1)
      assert.equal(geometry.reducedMotion, true)
      await active.focus()
      assert.equal(await active.evaluate(element => getComputedStyle(element).outlineStyle), 'solid')
      await page.locator('h1').click()
      await nav.screenshot({ path: path.join(evidence, `nav-${scenario.name}.png`) })
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    await page.screenshot({ path: path.join(evidence, `nav-page-${scenario.name}.png`) })
    assert.deepEqual(errors, [])
  } finally { await context.close() }
}

async function checkMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 860 }, reducedMotion: 'no-preference' })
  try {
    // Freeze the shrink-out phase at a known point rather than racing the animation under browser load.
    await context.addInitScript(() => {
      window.freezeNavMotion = false
      window.navMotionEvents = []
      const animate = Element.prototype.animate
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args)
        if (this.classList.contains('bottom-nav__indicator')) window.navMotionEvents.push({ frozen: window.freezeNavMotion, duration: args[1].duration })
        if (window.freezeNavMotion && this.classList.contains('bottom-nav__indicator')) {
          animation.pause()
          animation.currentTime = 110
        }
        return animation
      }
    })
    const page = await context.newPage()
    await page.goto('http://localhost:5173/app/tasks')
    const nav = page.locator('.bottom-nav')
    const indicator = nav.locator('.bottom-nav__indicator')
    await indicator.waitFor({ state: 'visible' })
    const start = await indicator.boundingBox()
    const initialActiveWidth = await nav.locator('a.active').evaluate(link => link.offsetWidth)
    await page.evaluate(() => { window.freezeNavMotion = true })
    await nav.getByRole('link', { name: 'PULIH' }).click()
    await page.waitForFunction(() => document.querySelector('.bottom-nav a[href="/app/pulih"]')?.getAttribute('aria-current') === 'page')
    const motion = await indicator.evaluate(element => {
      const animation = element.getAnimations()[0]
      if (!animation) return { missing: true, events: window.navMotionEvents, route: location.pathname, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches }
      animation.pause()
      animation.currentTime = 110
      const nav = element.parentElement
      const active = nav.querySelector('a.active')
      return {
        duration: animation.effect.getTiming().duration,
        easing: animation.effect.getTiming().easing,
        hiddenRelocation: animation.effect.getKeyframes().slice(1, 3).every(frame => Number(frame.opacity) === 0),
        opacity: Number(getComputedStyle(element).opacity),
        width: element.getBoundingClientRect().width,
        x: element.getBoundingClientRect().left,
        target: nav.getBoundingClientRect().left + nav.clientLeft + active.offsetLeft,
      }
    })
    assert.ok(!motion.missing, `Tab change must create a shared-indicator animation: ${JSON.stringify(motion)}`)
    assert.equal(motion.duration, 340)
    assert.equal(motion.easing, 'ease-in-out')
    assert.equal(motion.hiddenRelocation, true)
    assert.ok(motion.width < start.width && motion.width > 0, 'Previous capsule must shrink before disappearing')
    assert.ok(motion.opacity < 1 && motion.opacity > 0, 'Previous capsule must fade while shrinking')
    const nextActiveWidth = await nav.locator('a.active').evaluate(link => link.offsetWidth)
    assert.equal(nextActiveWidth, initialActiveWidth, 'Active pill width must be identical for tasks and PULIH')
    assert.ok(Math.abs(motion.x + motion.width / 2 - (start.x + start.width / 2)) < 1, 'Previous capsule must collapse in place instead of sliding')
    // Interrupt the movement: the next tab should continue from the current visual position.
    await page.evaluate(() => { window.freezeNavMotion = false })
    await nav.getByRole('link', { name: 'Pengaturan' }).click()
    const aligned = () => {
      const nav = document.querySelector('.bottom-nav')
      const indicator = nav.querySelector('.bottom-nav__indicator')
      const active = nav.querySelector('a.active')
      const box = indicator.getBoundingClientRect()
      const target = nav.getBoundingClientRect().left + nav.clientLeft + active.offsetLeft
      return active.getAttribute('href') === '/app/settings' && Math.abs(box.left - target) < 1 && Math.abs(box.width - active.offsetWidth) < 1
    }
    await page.waitForFunction(aligned)
    assert.equal(await nav.locator('a.active').evaluate(link => link.offsetWidth), initialActiveWidth, 'Settings must use the same active pill width')
    await page.setViewportSize({ width: 320, height: 860 })
    await page.waitForFunction(aligned)
    await nav.screenshot({ path: path.join(evidence, 'nav-motion-final.png') })
  } finally { await context.close() }
}

;(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
  try {
    const scenarios = [
      { name: 'dashboard-light', width: 390, theme: 'light', language: 'id', route: '/app/dashboard' },
      { name: 'tasks-light', width: 390, theme: 'light', language: 'id', route: '/app/tasks' },
      { name: 'pulih-dark', width: 390, theme: 'dark', language: 'id', route: '/app/pulih' },
      { name: 'rest-light', width: 390, theme: 'light', language: 'id', route: '/app/rest' },
      { name: 'settings-light', width: 390, theme: 'light', language: 'id', route: '/app/settings' },
      { name: 'small-english', width: 320, theme: 'dark', language: 'en', route: '/app/settings' },
      { name: 'admin-tablet', width: 768, theme: 'dark', language: 'id', route: '/admin/prices' },
      { name: 'desktop', width: 1440, theme: 'light', language: 'en', route: '/app/dashboard' },
    ]
    const results = await Promise.allSettled([...scenarios.map(scenario => checkNavigation(browser, scenario)), checkMotion(browser)])
    for (const result of results) {
      if (result.status === 'rejected') throw result.reason
    }
    console.log('PASS: 8 navigation scenarios + shared-indicator motion, mid-transition position, interrupted navigation and resize alignment; 44px targets, focus, reduced motion, themes/languages, 320/390/768/1440px layouts')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })

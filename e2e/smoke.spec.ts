import { test, expect } from '@playwright/test'

test('landing page smoke', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /tech lead dashboard/i })).toBeVisible()
  await expect(page.getByRole('button').first()).toBeVisible()
})

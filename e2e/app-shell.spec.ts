import { test, expect } from "@playwright/test"

test.describe("App shell E2E (AS-10)", () => {
  test("V1 default: 12 repo cards render on /", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator('[data-testid="repo-card"]')).toHaveCount(12)
  })

  test("theme toggle flips data-theme on <html>", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
    await page.getByRole("button", { name: /Theme/i }).click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
  })

  test("V4 tab updates URL and persists across reload", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("tab", { name: /V4/ }).click()
    await expect(page).toHaveURL(/[?&]v=v4(?:&|$)/)
    await expect(page.getByTestId("variation-v4")).toBeVisible()
    await page.reload()
    await expect(page.getByTestId("variation-v4")).toBeVisible()
  })

  test("invalid ?v=hacker falls back to V1 (AS-1)", async ({ page }) => {
    await page.goto("/?v=hacker")
    await expect(page.getByTestId("variation-v1")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: /Repos & pipelines/i })
    ).toBeVisible()
  })
})

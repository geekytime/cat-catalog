import { test, expect } from '@playwright/test'

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  const catName = 'flowers'
  await page.fill('.CatQuery input', catName)
  await page.click('.CatQuery .forget-cat')
  await page.fill('.CatQuery input', catName)
  await page.click('.CatQuery .new-cat')
  const catItem = await page.locator('.CatItem', { hasText: catName })
  await catItem.waitFor()
  const isNewCatVisible = await catItem.isVisible()
  expect(isNewCatVisible).toBeTruthy()
  await page.fill('.CatQuery input', catName)
  await page.click('.CatQuery .forget-cat')
})

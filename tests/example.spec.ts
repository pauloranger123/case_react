
import { test, expect } from '@playwright/test'

test('o marketplace Kurio abre corretamente', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await expect(
    page.getByRole('heading', {
      name: 'Seja dono do futuro da arte digital',
    }),
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { name: 'Explore os NFTs' }),
  ).toBeVisible()
})



test('permite ver a NFT e detalhes', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await page.getByRole('link', { name: 'Ver NFT' }).first().click()

  await expect(page).toHaveURL(/\/nft\/\d+/)
})



test('permite adicionar um NFT ao carrinho', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await page.getByRole('link', { name: 'Ver NFT' }).first().click()

  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()

  await page.goto('http://localhost:5173/cart')

  await expect(page.getByText('Digital Ape', { exact: false }).first()).toBeVisible()
})

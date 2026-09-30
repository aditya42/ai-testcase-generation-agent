import { test, expect } from '@playwright/test';
test('checkout remains recoverable after decline', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByTestId('card-token').fill('tok_decline');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByRole('alert')).toContainText('declined');
  await expect(page.getByRole('button', { name: 'Place order' })).toBeEnabled();
});
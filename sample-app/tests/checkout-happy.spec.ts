import { test, expect } from '@playwright/test';
test('successful checkout', async ({ request }) => {
  const response = await request.post('/api/payments/authorize', { data: { cardToken: 'tok_success' }});
  expect(response.ok()).toBeTruthy();
});

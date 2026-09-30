import { test, expect } from '@playwright/test';
test('declined payment does not create order', async ({ request }) => {
  const r = await request.post('/api/payments/authorize', { data: { orderId:'demo-1', cardToken:'tok_decline' } });
  expect(r.status()).toBe(402);
  expect(await r.json()).toMatchObject({ status:'DECLINED' });
});
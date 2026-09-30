import type { AnalysisResult, Scenario, SourceArtifact } from '@testgen/core';
import crypto from 'node:crypto';

const has=(xs:SourceArtifact[], re:RegExp)=>xs.some(x=>re.test(x.content+' '+x.name));
const evidence=(xs:SourceArtifact[], re:RegExp)=>xs.filter(x=>re.test(x.content+' '+x.name)).slice(0,3).map(x=>({sourceId:x.id,sourceType:x.type,excerpt:(x.content.match(re)?.[0]||x.name).slice(0,180)}));

export function analyze(artifacts:SourceArtifact[]):AnalysisResult {
 const payment=has(artifacts,/payment|card|declin/i), auth=has(artifacts,/auth|login|token/i), defects=artifacts.filter(x=>x.type==='defect');
 const components=[payment?'payment':null,auth?'authentication':null,has(artifacts,/order|checkout/i)?'checkout':null].filter(Boolean) as string[];
 const gaps:string[]=[]; const scenarios:Scenario[]=[];
 if(payment){
   gaps.push('Payment decline/error handling after changed payment path');
   scenarios.push({id:'SCN-PAY-001',title:'Reject a declined card without creating an order',layer:'api',priority:'P0',riskScore:92,riskReasons:['Revenue-critical payment path','Payment-related change detected',defects.length?'Historical production defects supplied':'Negative-path coverage'],evidence:evidence(artifacts,/payment|declin|402|card/i),given:['a valid checkout session','a card configured to decline'],when:['POST /api/payments/authorize is called'],then:['HTTP 402 is returned','no order is created','decline reason is preserved'],generatedCode:`import { test, expect } from '@playwright/test';\ntest('declined payment does not create order', async ({ request }) => {\n  const r = await request.post('/api/payments/authorize', { data: { orderId:'demo-1', cardToken:'tok_decline' } });\n  expect(r.status()).toBe(402);\n  expect(await r.json()).toMatchObject({ status:'DECLINED' });\n});`});
   scenarios.push({id:'SCN-PAY-002',title:'Display payment decline and keep checkout recoverable',layer:'ui',priority:'P0',riskScore:88,riskReasons:['Customer-facing checkout','Same backend risk exposed through UI'],evidence:evidence(artifacts,/payment|checkout|declin/i),given:['customer is on checkout','declining payment method is selected'],when:['customer submits the order'],then:['decline message is visible','checkout remains usable','duplicate order is not created'],generatedCode:`import { test, expect } from '@playwright/test';\ntest('checkout remains recoverable after decline', async ({ page }) => {\n  await page.goto('/checkout');\n  await page.getByTestId('card-token').fill('tok_decline');\n  await page.getByRole('button', { name: 'Place order' }).click();\n  await expect(page.getByRole('alert')).toContainText('declined');\n  await expect(page.getByRole('button', { name: 'Place order' })).toBeEnabled();\n});`});
 }
 if(auth) gaps.push('Authorization boundary and expired-token behavior');
 if(!scenarios.length) scenarios.push({id:'SCN-GEN-001',title:'Validate changed happy path and failure boundary',layer:'api',priority:'P1',riskScore:65,riskReasons:['Changed behavior supplied','No matching regression scenario detected'],evidence:artifacts.slice(0,2).map(x=>({sourceId:x.id,sourceType:x.type,excerpt:x.content.slice(0,180)})),given:['valid request context'],when:['changed behavior is invoked'],then:['contract remains valid','failure behavior is explicit'],generatedCode:`import { test, expect } from '@playwright/test';\ntest('changed API contract', async ({ request }) => { const r = await request.get('/health'); expect(r.ok()).toBeTruthy(); });`});
 const max=Math.max(...scenarios.map(s=>s.riskScore));
 return {runId:crypto.randomUUID(),summary:`Analyzed ${artifacts.length} artifacts; identified ${components.length||1} impacted area(s) and ${gaps.length} coverage gap(s).`,riskScore:max,changedComponents:components.length?components:['unknown-change-surface'],coverageGaps:gaps,scenarios};
}

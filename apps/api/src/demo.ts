import { analyze } from './services/analyzer.js';
const result=analyze([
{id:'REQ-142',type:'requirement',name:'Payment decline',content:'Checkout must reject declined card payments and allow retry without creating an order.'},
{id:'DIFF-1',type:'diff',name:'PaymentService.ts',content:'+ changed payment authorization and order creation flow'},
{id:'DEF-391',type:'defect',name:'Duplicate order after decline',content:'Production defect: declined payment could create duplicate order on retry.'},
{id:'TEST-8',type:'existing_test',name:'checkout-happy.spec.ts',content:'tests successful card checkout only'}]);
console.log(JSON.stringify(result,null,2));

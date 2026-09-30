import 'dotenv/config'; import Fastify from 'fastify'; import cors from '@fastify/cors'; import { z } from 'zod'; import { runAgent } from './agent/pipeline.js';
const app=Fastify({logger:true}); await app.register(cors,{origin:true});
const Artifact=z.object({id:z.string(),type:z.enum(['requirement','openapi','diff','existing_test','defect','source_code']),name:z.string(),content:z.string(),path:z.string().optional()});
app.get('/health',async()=>({status:'ok',service:'ai-test-case-generation-agent'}));
app.post('/api/analyze',async(req,reply)=>{const parsed=z.object({artifacts:z.array(Artifact).min(1)}).safeParse(req.body); if(!parsed.success)return reply.code(400).send({error:parsed.error.flatten()}); return runAgent(parsed.data.artifacts);});
app.post('/api/generate',async(req,reply)=>{const parsed=z.object({artifacts:z.array(Artifact).min(1)}).safeParse(req.body); if(!parsed.success)return reply.code(400).send({error:parsed.error.flatten()}); return (await runAgent(parsed.data.artifacts)).scenarios;});
await app.listen({port:Number(process.env.PORT||8080),host:'0.0.0.0'});

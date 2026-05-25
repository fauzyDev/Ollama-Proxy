import { Hono } from 'hono';
import { handleGetVersion } from '@/services/ollama.services';

export const healthRoute = new Hono()

healthRoute.get('/', () => {
  return Response.json({
    status: 'ok',
    message: 'Ollama Proxy is running',
  })
})

healthRoute.get('/api/version', handleGetVersion)
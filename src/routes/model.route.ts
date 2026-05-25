import { Hono } from 'hono'
import { handleGetListModels, handleGetModelsDetails } from '@/services/ollama.services'

export const modelsRoute = new Hono()

modelsRoute.get('/api/tags', handleGetListModels)
modelsRoute.post('/api/show', handleGetModelsDetails)
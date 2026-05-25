import { Hono } from "hono";
import { cors } from "hono/cors";
import { healthRoute } from "@/routes/healt.route";
import { modelsRoute } from '@/routes/model.route';
import { chatRouter } from '@/routes/chat.route';

const app = new Hono()

app.use("*", cors())

app.route('/', healthRoute)
app.route('/', modelsRoute)
app.route('/', chatRouter)

export default app

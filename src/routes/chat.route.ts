import { Hono } from "hono";
import { handleChatCompletions } from "@/services/ollama.services";

export const chatRouter = new Hono()

chatRouter.post("/v1/chat/completions", handleChatCompletions)
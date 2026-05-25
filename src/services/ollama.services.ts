import type { Context } from 'hono';
import type { ChatCompletionBody } from "@/types/openai";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

export const handleGetVersion = async () => {
    try {
        const response = await fetch(`${env.OLLAMA_HOST}/api/version`, {
            headers: {
                Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
            },
        })

        const data = await response.json()

        return Response.json(data)
    } catch (error) {
        logger('Server Error', error)
        return Response.json({ error: "Proxy error" }, { status: 500 })
    }
}

export const handleGetListModels = async () => {
    try {
        const response = await fetch(`${env.OLLAMA_HOST}/api/tags`, {
            headers: {
                Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
            },
        })

        const data = await response.json()

        return Response.json(data)
    } catch (error) {
        logger('Server Error', error)
        return Response.json({ error: "Proxy error" }, { status: 500 })
    }
}

export const handleGetModelsDetails = async (c: Context) => {
    try {
        const body = await c.req.json()

        const response = await fetch(`${env.OLLAMA_HOST}/api/show`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        return Response.json(data)
    } catch (error) {
        logger('Server Error', error)
        return Response.json({ error: "Proxy error" }, { status: 500 })
    }
}

export const handleChatCompletions = async (c: Context) => {
    try {
        const body = (await c.req.json()) as ChatCompletionBody;

        logger('Chat Request', { model: body.model })

        const upstream = await fetch(`${env.OLLAMA_HOST}/v1/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: body.model,
                messages: body.messages,
                tools: body.tools, // PASS RAW
                tool_choice: body.tool_choice,
                stream: true,      // IMPORTANT
            }),
        })

        const headers = new Headers(upstream.headers)
        headers.set('Access-Control-Allow-Origin', '*')

        if (!upstream.ok) {
            const err = await upstream.text()

            logger('Ollama Error', err)

            return Response.json({ error: err }, upstream.status as any)
        }

        logger('Ollama Response')

        if (!upstream.body) {
            return Response.json({ error: "Empty response stream" }, { status: 500 })
        }

        /**
         * 🔥 CRITICAL: NO TRANSFORM STREAM
         * Just pipe it directly
         */
        return new Response(upstream.body, {
            status: upstream.status,
            headers,
        })
    } catch (error) {
        logger('Server Error', error)
        return Response.json({ error: "Proxy error" }, { status: 500 })
    }
}
# API Documentation - Ollama Proxy

Dokumentasi lengkap untuk semua API endpoints yang tersedia di Ollama Proxy.

## 🔗 Base URL

```
http://localhost:3000
```

## 🔐 Authentication

Semua requests ke Ollama backend menggunakan:

```
Authorization: Bearer {OLLAMA_API_KEY}
Content-Type: application/json
```

**Note:** Proxy tidak menerima auth header dari client, auth dilakukan di backend secara otomatis berdasarkan `OLLAMA_API_KEY` env variable.

---

## 📡 Health & Status Endpoints

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "ok": true
}
```

**Status Code:** `200 OK`

**Contoh:**
```bash
curl http://localhost:3000/health
```

---

### Get Server Version

**Endpoint:** `GET /api/version`

**Response:**
```json
{
  "version": "0.1.2-rc1",
  "build_number": "100",
  "build_sha": "abc123"
}
```

**Status Code:** `200 OK`

**Contoh:**
```bash
curl http://localhost:3000/api/version
```

---

## 🤖 Model Management Endpoints

### List All Available Models

**Endpoint:** `GET /api/tags`

**Response:**
```json
{
  "models": [
    {
      "name": "llama2:latest",
      "modified_at": "2024-01-15T10:30:00.000000000Z",
      "size": 3826519411,
      "digest": "sha256:xxxxx"
    },
    {
      "name": "mistral:latest",
      "modified_at": "2024-01-14T15:20:00.000000000Z",
      "size": 4829519411,
      "digest": "sha256:yyyyy"
    }
  ]
}
```

**Status Code:** `200 OK`

**Contoh:**
```bash
curl http://localhost:3000/api/tags
```

---

### Get Model Details

**Endpoint:** `POST /api/show`

**Request Body:**
```json
{
  "name": "llama2:latest"
}
```

**Response:**
```json
{
  "name": "llama2:latest",
  "modified_at": "2024-01-15T10:30:00.000000000Z",
  "size": 3826519411,
  "digest": "sha256:xxxxx",
  "details": {
    "format": "gguf",
    "family": "llama",
    "families": ["llama"],
    "parameter_size": "7B",
    "quantization_level": "Q4_0"
  },
  "model_info": {
    "template": "[INST] {{.Prompt}} [/INST]",
    "license": "...",
    "messages": [...]
  }
}
```

**Status Code:** `200 OK`

**Error Response:**
```json
{
  "error": "Model not found"
}
```

**Status Code:** `404 Not Found`

**Contoh:**
```bash
curl -X POST http://localhost:3000/api/show \
  -H "Content-Type: application/json" \
  -d '{"name": "llama2:latest"}'
```

---

## 💬 Chat Completions Endpoint

### Create Chat Completion

**Endpoint:** `POST /v1/chat/completions`

**Request Body:**
```json
{
  "model": "llama2:latest",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Apa itu artificial intelligence?"
    }
  ],
  "stream": false,
  "temperature": 0.7,
  "top_p": 0.9,
  "top_k": 40
}
```

**Response (Non-Streaming):**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1705315200,
  "model": "llama2:latest",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Artificial Intelligence adalah teknologi yang memungkinkan mesin untuk belajar dan membuat keputusan..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 150,
    "total_tokens": 192
  }
}
```

**Response (Streaming):**
```
data: {"choices":[{"delta":{"content":"Artificial"}}]}
data: {"choices":[{"delta":{"content":" Intelligence"}}]}
data: {"choices":[{"delta":{"content":"..."}}]}
data: [DONE]
```

**Status Code:** `200 OK`

**Contoh - Non-Streaming:**
```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:latest",
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "stream": false
  }'
```

**Contoh - Streaming:**
```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:latest",
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "stream": true
  }' \
  | jq '.choices[0].delta.content'
```

---

## 🛠️ Function Calling / Tools

### Request dengan Tools

**Endpoint:** `POST /v1/chat/completions`

**Request Body:**
```json
{
  "model": "llama2:latest",
  "messages": [
    {
      "role": "user",
      "content": "Berapa suhu di Jakarta hari ini?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get weather information for a specific location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name"
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"],
              "description": "Temperature unit"
            }
          },
          "required": ["location"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

**Response dengan Tool Call:**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1705315200,
  "model": "llama2:latest",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "tool_calls": [
          {
            "id": "call_123",
            "type": "function",
            "function": {
              "name": "get_weather",
              "arguments": "{\"location\": \"Jakarta\", \"unit\": \"celsius\"}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}
```

**Tool Choice Options:**
- `"auto"` - Model memilih untuk menggunakan tool atau tidak
- `"required"` - Model harus menggunakan tool
- `{"type": "function", "function": {"name": "specific_function"}}` - Force tool tertentu

---

## 📊 Request Parameters

### Supported Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | required | Model name (e.g., "llama2:latest") |
| `messages` | array | required | Conversation messages |
| `stream` | boolean | false | Enable streaming responses |
| `temperature` | float | 0.7 | Randomness (0-2) |
| `top_p` | float | 0.9 | Nucleus sampling |
| `top_k` | int | 40 | Top-k sampling |
| `tools` | array | null | Function definitions |
| `tool_choice` | string\|object | null | Tool selection strategy |
| `max_tokens` | int | null | Max response tokens |
| `stop` | array | null | Stop sequences |

### Message Format

```json
{
  "role": "user|assistant|system",
  "content": "Message content"
}
```

**Role Types:**
- `system` - System instructions untuk model
- `user` - User message
- `assistant` - Assistant response (untuk context)
- `tool` - Tool result

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request: missing required field 'model'"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or missing authentication"
}
```

### 404 Not Found
```json
{
  "error": "Model not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Proxy error"
}
```

---

## 🔄 Response Headers

```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 📝 Examples

### Python dengan OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="not-required",
    base_url="http://localhost:3000/v1"
)

response = client.chat.completions.create(
    model="llama2:latest",
    messages=[
        {"role": "user", "content": "Halo!"}
    ]
)

print(response.choices[0].message.content)
```

### JavaScript dengan fetch

```javascript
const response = await fetch('http://localhost:3000/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama2:latest',
    messages: [
      { role: 'user', content: 'Halo!' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Streaming dengan JavaScript

```javascript
const response = await fetch('http://localhost:3000/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama2:latest',
    messages: [
      { role: 'user', content: 'Halo!' }
    ],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.choices[0].delta.content) {
        process.stdout.write(data.choices[0].delta.content);
      }
    }
  }
}
```

---

Last Updated: 2026-05-25

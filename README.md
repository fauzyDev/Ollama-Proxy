# Ollama Proxy

Ollama Proxy adalah API proxy server yang dibangun dengan Hono.js dan Bun untuk memforward permintaan chat completion ke Ollama API. Server ini menyediakan endpoint yang compatible dengan OpenAI API format, sehingga dapat diintegrasikan dengan berbagai aplikasi yang mendukung OpenAI API.

## 🌟 Fitur

- ✅ Chat Completions API - Interface compatible dengan OpenAI API
- ✅ Model Management - List dan tampilkan detail model Ollama
- ✅ CORS Support - Mendukung cross-origin requests
- ✅ Streaming Response - Support streaming untuk chat completions
- ✅ Tool/Function Calling - Support tools dan tool_choice
- ✅ Error Handling - Comprehensive error handling dan logging
- ✅ Built with Bun - Runtime TypeScript yang cepat
- ✅ Hono Framework - Lightweight web framework

## 📋 Requirements

- [Bun](https://bun.sh/) - Runtime TypeScript (v1.0 atau lebih baru)
- Node.js 18+ (sebagai alternatif jika tidak menggunakan Bun)
- Ollama running di server (default: https://ollama.com)
- API Key untuk Ollama (jika diperlukan)

## 🚀 Installation

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd ollama-proxy
```

### Step 2: Install Dependencies
```bash
bun install
```

### Step 3: Konfigurasi Environment Variable
Buat file `.env` atau set environment variables:

```bash
# .env file example
OLLAMA_HOST=https://ollama.com
OLLAMA_API_KEY=your-api-key-here
```

**Environment Variables:**
- `OLLAMA_HOST` - URL untuk Ollama API (default: `https://ollama.com`)
- `OLLAMA_API_KEY` - API Key untuk Ollama (default: kosong)

### Step 4: Jalankan Server

**Development Mode:**
```bash
bun run dev
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### 1. Health Check
```bash
GET /health
```
Response: `{ "ok": true }`

### 2. Get Server Version
```bash
GET /api/version
```

### 3. List Available Models
```bash
GET /api/tags
```

Response contoh:
```json
{
  "models": [
    {
      "name": "llama2:latest",
      "modified_at": "2024-01-01T00:00:00.000000000Z",
      "size": 3826519411,
      "digest": "..."
    }
  ]
}
```

### 4. Get Model Details
```bash
POST /api/show

Body:
{
  "name": "llama2:latest"
}
```

### 5. Chat Completions (OpenAI Compatible)
```bash
POST /v1/chat/completions

Body:
{
  "model": "llama2:latest",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "stream": true
}
```

**Dengan Tools/Function Calling:**
```json
{
  "model": "llama2:latest",
  "messages": [...],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get weather information"
      }
    }
  ],
  "tool_choice": "auto"
}
```

## 🏗️ Project Structure

```
ollama-proxy/
├── src/
│   ├── server.ts              # Main server entry point
│   ├── config/
│   │   └── env.ts             # Environment variables config
│   ├── lib/
│   │   └── logger.ts          # Logging utility
│   ├── routes/
│   │   ├── chat.route.ts      # Chat completions routes
│   │   ├── healt.route.ts     # Health check routes
│   │   └── model.route.ts     # Model management routes
│   ├── services/
│   │   └── ollama.services.ts # Ollama API service handlers
│   └── types/
│       └── openai.ts          # TypeScript interfaces
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## 📖 Penggunaan

### Contoh 1: Chat dengan Curl
```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:latest",
    "messages": [
      {"role": "user", "content": "Apa itu AI?"}
    ]
  }'
```

### Contoh 2: JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:3000/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'llama2:latest',
    messages: [
      { role: 'user', content: 'Hello!' }
    ]
  })
});

const data = await response.json();
console.log(data);
```

### Contoh 3: Python
```python
import requests

response = requests.post('http://localhost:3000/v1/chat/completions', json={
    'model': 'llama2:latest',
    'messages': [
        {'role': 'user', 'content': 'Hello!'}
    ]
})

print(response.json())
```

## 🛠️ Development

### Development Server dengan Hot Reload
```bash
bun run dev
```

### Build untuk Production
```bash
bun build src/server.ts
```

### Debugging
Logs akan ditampilkan di console dengan format:
```
[LOG_TYPE] - Detail informasi
```

## 🔧 Konfigurasi Lanjutan

### Custom Ollama Host
Untuk menggunakan Ollama local:
```bash
OLLAMA_HOST=http://localhost:11434
```

### Docker Integration
Jika ingin menjalankan dengan Docker:
```dockerfile
FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lockb .
RUN bun install

COPY src ./src
COPY tsconfig.json .

EXPOSE 3000
CMD ["bun", "run", "dev"]
```

## 📝 Git Setup untuk Upload

### Initialize Git (jika belum)
```bash
git init
git add .
git commit -m "Initial commit: Ollama Proxy API"
```

### Hubungkan ke GitHub
```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

### File yang Sudah Ignore (Recommended)
Pastikan `.gitignore` sudah berisi:
```
node_modules/
.env
.env.local
dist/
build/
*.log
```

## 🤝 Contributing

Jika ingin berkontribusi:
1. Fork repository
2. Buat branch feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

MIT License - Silakan gunakan untuk project personal atau komersial

## 🆘 Troubleshooting

### Koneksi Error ke Ollama
- Pastikan Ollama sudah running
- Cek `OLLAMA_HOST` environment variable
- Cek network connectivity

### CORS Error
- Server sudah mengaktifkan CORS untuk semua origin
- Jika masalah persisten, check browser console untuk detail error

### Port 3000 Sudah Digunakan
```bash
# Ganti port dengan mengubah server.ts atau:
PORT=3001 bun run dev
```

## 📞 Support

Untuk bantuan atau pertanyaan, silakan buat Issue di GitHub repository ini.

---

**Last Updated:** 2026-05-25

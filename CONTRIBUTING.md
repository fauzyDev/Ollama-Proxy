# Contributing to Ollama Proxy

Terima kasih telah tertarik untuk berkontribusi pada project Ollama Proxy! Berikut adalah panduan cara berkontribusi.

## 🎯 Cara Berkontribusi

### 1. Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd ollama-proxy

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi lokal Anda
```

### 2. Buat Feature Branch

```bash
git checkout -b feature/nama-fitur
# atau untuk bug fixes:
git checkout -b fix/nama-bug
```

### 3. Development Workflow

```bash
# Jalankan development server
bun run dev

# Buat perubahan Anda di src/

# Test perubahan Anda secara manual atau dengan tools favorit Anda
```

### 4. Commit dengan Conventional Commits

```bash
git add .
git commit -m "feat: deskripsi fitur baru"
# atau
git commit -m "fix: deskripsi perbaikan bug"
git commit -m "docs: update dokumentasi"
git commit -m "refactor: improve code quality"
```

### 5. Push dan Buat Pull Request

```bash
git push origin feature/nama-fitur
```

Kemudian buat Pull Request di GitHub dengan deskripsi yang jelas.

## 📋 Commit Message Format

Gunakan Conventional Commits format:

- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Dokumentasi
- `style:` - Format/style code (tidak mengubah logic)
- `refactor:` - Refactor code
- `perf:` - Performance improvement
- `test:` - Menambah tests
- `chore:` - Build, dependencies, etc

Contoh:
```
feat: add streaming support untuk chat completions
fix: handle empty response stream error
docs: update API documentation
```

## 🔍 Code Review Checklist

Sebelum submit PR, pastikan:

- [ ] Code mengikuti TypeScript best practices
- [ ] Tidak ada error di console
- [ ] Testing sudah dilakukan
- [ ] Dokumentasi sudah updated
- [ ] Commit message jelas dan deskriptif
- [ ] Branch sudah di-pull dari main branch terbaru

## 📚 Project Structure

```
src/
├── config/     - Configuration files
├── lib/        - Utility libraries
├── routes/     - API routes
├── services/   - Business logic
└── types/      - TypeScript types
```

## 🧪 Testing

Silakan test perubahan Anda secara manual menggunakan:

```bash
# Curl
curl -X POST http://localhost:3000/v1/chat/completions ...

# Atau menggunakan REST Client di VS Code
```

## 📝 Documentation

Jika menambah fitur baru, pastikan update:

1. README.md - Tambahkan deskripsi fitur
2. Inline comments - Jelaskan code kompleks
3. Type definitions - Update interfaces jika perlu

## 🚫 Hal yang Dihindari

- Jangan commit `.env` file
- Jangan push node_modules/
- Jangan hardcode credentials
- Jangan merge PR tanpa review

## ❓ Questions?

Jika ada pertanyaan, silakan:
1. Check existing issues dan discussions
2. Buat issue baru dengan label 'question'
3. Hubungi maintainer

Terima kasih telah berkontribusi! 🎉

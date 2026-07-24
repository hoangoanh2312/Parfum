# L'Essence Noire

Cửa hàng nước hoa (e-commerce) dạng **monorepo**:

- `client/` — React 18 + Vite 5 + TypeScript + TailwindCSS (SPA khách + trang admin)
- `server/` — Express 4 + TypeScript + MongoDB/Mongoose (REST API)

## Yêu cầu

- Node.js >= 20
- MongoDB (local hoặc Atlas)
- (Tùy chọn) Docker + Docker Compose, Redis

## Cấu hình biến môi trường

```bash
cp server/.env.example server/.env   # điền giá trị THẬT
cp client/.env.example client/.env    # VITE_API_URL
```

> ⚠️ **KHÔNG bao giờ commit / đóng gói file `.env`.** Xem `SECURITY.md`.

## Chạy local (không Docker)

```bash
# cài dependencies cho từng workspace
npm --workspace server install
npm --workspace client install

# chạy song song (từ thư mục gốc — cần cài devDeps gốc trước: npm install)
npm run dev
# hoặc riêng lẻ:
npm --workspace server run dev   # http://localhost:5000
npm --workspace client run dev   # http://localhost:5173
```

Tạo admin an toàn (thay cho auto-create):

```bash
npm --workspace server run create-admin
```

## Chạy bằng Docker Compose

```bash
cp server/.env.example server/.env   # điền giá trị
docker compose up -d --build
# client: http://localhost:8080  | server: http://localhost:5000  | mongo:27017 | redis:6379
```

## Scripts chính

| Lệnh (gốc) | Ý nghĩa |
|---|---|
| `npm run dev` | Chạy client + server song song |
| `npm run build` | Build cả hai |
| `npm run lint` | ESLint cả hai |
| `npm run typecheck` | `tsc --noEmit` cả hai |
| `npm test` | Test server (vitest) |
| `npm run format` | Prettier toàn repo |

Server: `npm --workspace server run test:coverage` để chạy test kèm coverage (ngưỡng cấu hình trong `vitest.config.ts`).

## CI/CD

- **GitHub Actions**: `.github/workflows/ci.yml` — chạy lint → typecheck → test → build cho cả hai, rồi build Docker image.
- **Deploy**: `render.yaml` (Render Blueprint) hoặc `docker-compose.yml` (VPS). Secret khai báo trong dashboard nền tảng, không commit.

## Kiến trúc server

```
routes/ → controllers/ → services/ → models/
middlewares/ (auth, rateLimit, sanitize, validate, csrf, upload, error)
validators/ (zod)  config/ (env, db, cloudinary, swagger)  utils/  scripts/
```

API mount tại `/api/v1` (khuyến dùng) và `/api` (tương thích ngược). Swagger tại đường dẫn cấu hình trong `config/swagger.ts`.

## Bảo mật (tóm tắt)

- JWT access (15') + refresh (7 ngày, httpOnly cookie).
- Access token giữ **in-memory** ở client + **silent refresh** (không dùng localStorage).
- **CSRF double-submit** cho endpoint dùng cookie (`/auth/refresh`, `/auth/logout`).
- Helmet + CSP + **HSTS**, CORS allowlist, chống NoSQL injection, rate limiting, bcrypt(12), webhook HMAC-SHA256.

Chi tiết & checklist rotate secret: xem `SECURITY.md`.

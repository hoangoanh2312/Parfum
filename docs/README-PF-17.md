# PF-17 — Model User + kết nối MongoDB + cấu hình env

Epic: 🔐 Xác thực & Phân quyền (PF-52-xac-thuc-phan-quyen)

## Cấu trúc file
```
.gitignore
server/
  .env            # bí mật, KHÔNG commit (đã bị .gitignore chặn)
  .env.example    # mẫu, CÓ commit
  src/
    config/
      env.ts      # đọc + validate biến môi trường
      db.ts       # kết nối MongoDB + xử lý lỗi
    models/
      user.model.ts
    index.ts      # nạp env + connectDB (điểm khởi động)
```

## Cách dùng
1. Copy `server/.env.example` thành `server/.env` và điền giá trị (MONGO_URI, JWT secrets).
2. Cài package: `npm i mongoose dotenv` (và `@types/node` nếu dùng TS).
3. Đảm bảo có MongoDB chạy (local hoặc `docker compose up mongo -d`).
4. Chạy server: `npm run dev` -> thấy "✅ MongoDB connected".

## DoD
- [x] Schema User (name, email unique, password, role, addresses)
- [x] Kết nối MongoDB, báo lỗi rõ khi thiết bị
- [x] Đọc + validate env, thiếu biến -> dừng sớm
- [x] Password không lộ ra API (select:false + toJSON transform)
- [x] `.env.example` + `.gitignore` cho đồng đội clone về chạy được

## KHÔNG thuộc PF-17 (làm ở task khác)
- Hash password / bcrypt -> PF-16
- Tạo/verify JWT, middleware -> PF-15
- Route/controller đăng nhập -> PF-16

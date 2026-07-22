# HOC PARFUM - E-commerce (MERN + TypeScript)

Monorepo: `server/` (Express + TS phan tang) va `client/` (Vite + React + TS + Tailwind).

## Chay nhanh
```bash
npm install            # cai workspaces
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev            # chay BE (5000) + FE (5173)
```

## Chay bang Docker
```bash
docker compose up --build
```

## Cau truc
- `server/src/{routes,controllers,services,models,middlewares,config}` - kien truc phan tang
- `client/src/{pages,components,store,lib}` - React + Zustand
- Swagger: http://localhost:5000/api/docs

Xem `ERD.md` de biet so do du lieu.

## Thanh toan VietQR tu dong

Khai bao trong `server/.env`:

```env
VIETQR_BANK_BIN=ma_BIN_ngan_hang
VIETQR_ACCOUNT_NO=so_tai_khoan_nhan
VIETQR_ACCOUNT_NAME=TEN_CHU_TAI_KHOAN
SEPAY_WEBHOOK_SECRET=secret_HMAC_tu_SePay
```

Tren SePay, tao webhook giao dich tien vao voi:

- URL: `https://your-domain/api/payment-webhooks/sepay`
- Bao mat: `HMAC-SHA256`
- Secret Key: trung voi `SEPAY_WEBHOOK_SECRET`
- Content type: `Json`

Server chi xac nhan thanh toan khi dung tai khoan nhan, dung ma don, dung so tien
va giao dich chua tung duoc xu ly.

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

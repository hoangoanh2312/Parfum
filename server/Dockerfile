#Đóng gói Backend
# ---------- build stage ----------
FROM node:24-alpine AS build
WORKDIR /app
#Sao chép package.json và package-lock.json
COPY package*.json ./

#Cài tất cả dependency
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
#Sao chép mã TypeScript
COPY . .
#Chạy TypeScript compiler
RUN npm run build 
# lệnh run biên dịch:src/index.ts → dist/index.js

# ---------- runtime stage ----------
FROM node:24-alpine
# Đặt môi trường production

ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
# Chỉ cài dependency cần khi chạy production

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
# Chỉ lấy thư mục dist đã được build ở giai đoạn build

COPY --from=build /app/dist ./dist
# Chạy ứng dụng bằng user "node" không có quyền root

USER node
EXPOSE 5000
# Healthcheck goi /api/health (fetch co san tu Node 18+).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Lệnh chạy khi container khởi động
  CMD ["node", "dist/index.js"]


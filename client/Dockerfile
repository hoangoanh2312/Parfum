# PF-45: build client (multi-stage) va phuc vu bang nginx
FROM node:24-alpine AS build
WORKDIR /app
# Sao chép package.json và package-lock.json
COPY package*.json ./
# Cài dependency của frontend
RUN npm install
# Sao chép toàn bộ source code
COPY . .
# Biến VITE_API_URL được truyền vào lúc Docker build.
# Vite sẽ nhúng giá trị này trực tiếp vào bundle frontend.
ARG VITE_API_URL=http://localhost:5000/api
# Đưa build argument thành biến môi trường để Vite sử dụng

ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
# Sao chép cấu hình Nginx.
# Cấu hình SPA fallback giúp refresh các route như /shop
# vẫn trả về index.html thay vì lỗi 404.
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Lấy kết quả build từ stage "build"
# và đưa vào thư mục mặc định Nginx phục vụ web
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
# Chạy Nginx ở foreground để container không tự thoát

  CMD ["nginx", "-g", "daemon off;"]

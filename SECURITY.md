# Security Notes / Ghi chu bao mat

Tai lieu nay ghi lai cac van de bao mat da xu ly trong code va **cac buoc BAT BUOC phai lam thu cong** ngoai repo (khong the tu dong hoa tu day).

## 1. Secrets da bi lo (PHAI xu ly ngay)

File `server/.env` truoc day bi commit kem repo, coi nhu TAT CA secret sau da lo va **phai doi ngay**:

| Secret | Hanh dong |
| --- | --- |
| `MONGO_URI` (user/password Atlas) | Vao MongoDB Atlas -> Database Access -> doi mat khau DB user (hoac tao user moi + xoa user cu). Cap nhat lai connection string. |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Da tu dong sinh gia tri ngau nhien moi trong `server/.env`. Khi deploy, dat gia tri rieng cho tung moi truong. |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Vao Cloudinary Console -> Settings -> Security -> **Regenerate API secret**. Cap nhat lai `.env`. |

> JWT secret da duoc rotate. Mongo va Cloudinary **phai rotate trong dashboard tuong ung** (khong the lam tu code).

## 2. Xoa `.env` khoi git history (chay thu cong)

Da them `.gitignore` (root + server + client) de khong commit `.env`, `dist/`, `node_modules/`, `uploads/` nua. Nhung file `.env` cu van con trong **lich su git**, can xoa han:

```bash
# Cach 1: git filter-repo (khuyen nghi)
pip install git-filter-repo
git filter-repo --path server/.env --invert-paths

# Cach 2: BFG Repo-Cleaner
bfg --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Sau do force-push (canh bao: viet lai lich su, bao dong doi)
git push origin --force --all
```

Sau khi xoa lich su, go bo file cache neu con theo doi:

```bash
git rm --cached server/.env
git commit -m "chore: remove committed .env"
```

## 3. Da xu ly trong code

- Them `.gitignore` cho root/server/client.
- Don sach dau xung dot merge trong `.env` / `.env.example` va rotate JWT secret.
- Refresh token chuyen sang **httpOnly cookie** (`utils/cookies.ts` + `api.ts` withCredentials); client chi giu access token.
- Siet **CSP + helmet** trong `app.ts`, them `express-mongo-sanitize` (middleware noi bo `sanitize.middleware.ts`).
- **Escape regex** cho tim kiem san pham (`utils/regex.ts`) chong ReDoS.
- **Rate limit chat** rieng cho `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password` (10 req / 15 phut).
- **Error handler** an chi tiet loi 500 o production + logger tap trung (`utils/logger.ts`).

## 4. Luu y khi deploy that

- `rateLimit` hien luu in-memory theo tien trinh -> khi chay nhieu instance can chuyen sang **Redis store**.
- Cau hinh SMTP that (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`) de luong quen mat khau / xac thuc email gui duoc email.
- Cai them devDependencies moi (`vitest`, `@types/nodemailer`) roi chay `npm test`; CI (`.github/workflows/ci.yml`) se chay lint + build + test.

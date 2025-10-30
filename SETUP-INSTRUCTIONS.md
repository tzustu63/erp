# 安裝與設定說明

## 📋 前置需求

- Node.js 18+ 
- PostgreSQL 14+
- npm 或 yarn

## 🚀 安裝步驟

### 1. 複製專案

```bash
git clone <repository-url>
cd erp
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定資料庫

#### 使用 PostgreSQL

```bash
# 連接到 PostgreSQL
psql -U postgres

# 建立資料庫
CREATE DATABASE erp_inventory;

# 離開 PostgreSQL CLI
\q

# 執行 Schema
psql -U postgres -d erp_inventory -f database/schema.sql
```

#### 或使用 Prisma

```bash
# 產生 Prisma Client
npm run db:generate

# 推送 Schema 到資料庫
npm run db:push
```

### 4. 設定環境變數

建立 `.env` 檔案（參考 `.env.example`）：

```bash
cp .env.example .env
```

編輯 `.env` 並填入您的資料庫連線資訊：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/erp_inventory?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 5. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問：http://localhost:3000

## 🔑 產生 Secret Key

```bash
openssl rand -base64 32
```

將產生的字串填入 `NEXTAUTH_SECRET`

## 🗄️ 資料庫管理

### Prisma Studio（視覺化資料庫管理）

```bash
npm run db:studio
```

開啟 http://localhost:5555

### 建立 Migration

```bash
npm run db:migrate
```

### 產生 Prisma Client

```bash
npm run db:generate
```

## 🧪 測試

```bash
# 執行測試
node src/tests/inventory-test.js
```

## 📦 建置生產版本

```bash
npm run build
npm start
```

## 🌐 部署

### Vercel

1. 將專案推送到 GitHub
2. 在 Vercel 匯入專案
3. 設定環境變數
4. 部署完成

### Docker

```bash
# 建置映像
docker build -t erp-inventory .

# 執行容器
docker run -p 3000:3000 erp-inventory
```

## 📊 預設資料

您可以使用以下 SQL 建立測試資料：

```sql
-- 插入測試產品
INSERT INTO products (code, name, category, unit, cost_price, sales_price)
VALUES 
  ('PROD-001', '產品A', '電子產品', '個', 100.00, 150.00),
  ('PROD-002', '產品B', '辦公用品', '箱', 500.00, 750.00);

-- 插入測試廠商
INSERT INTO suppliers (code, name, tax_id, contact, payment_terms)
VALUES 
  ('SUP-001', '廠商A', '12345678', 'contact@supplier-a.com', '月結');

-- 插入測試客戶
INSERT INTO customers (code, name, tax_id, contact, credit_limit)
VALUES 
  ('CUS-001', '客戶A', '87654321', 'contact@customer-a.com', 100000.00);
```

## 🆘 常見問題

### 問題：無法連接到資料庫

**解決方案**：
1. 確認 PostgreSQL 正在運行
2. 檢查 `DATABASE_URL` 是否正確
3. 確認資料庫名稱是否存在

### 問題：Prisma Client 未產生

**解決方案**：
```bash
npm run db:generate
```

### 問題：Port 3000 已被佔用

**解決方案**：
```bash
# 使用其他 port
PORT=3001 npm run dev
```

### 問題：Tailwind CSS 樣式未生效

**解決方案**：
```bash
# 重新啟動開發伺服器
npm run dev
```

## 📚 下一步

- [ ] 閱讀 [WEB-IMPLEMENTATION.md](./WEB-IMPLEMENTATION.md)
- [ ] 查看 [UI 設計文件](./openspec/changes/initial-inventory-system/ui-design.md)
- [ ] 實作剩餘的 API 路由
- [ ] 建立更多的前端頁面
- [ ] 設定認證系統

## 💡 提示

- 使用 `npm run db:studio` 可視化管理資料庫
- 使用瀏覽器開發工具檢查 API 請求
- 查看瀏覽器 Console 取得錯誤訊息

祝您使用愉快！🎉


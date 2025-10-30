# Web 版本實作指南

## 🎉 已完成的工作

已將進銷存系統從 Excel 版本轉換為 Web + Database 版本！

## 📦 已建立的檔案

### 資料庫層
- ✅ `database/schema.sql` - PostgreSQL 完整 Schema（12 個表）
- ✅ `prisma/schema.prisma` - Prisma ORM Schema

### Web 應用層
- ✅ `package.json` - Next.js 專案配置
- ✅ `lib/db.js` - 資料庫連接設定
- ✅ `app/layout.js` - 應用程式根布局
- ✅ `app/globals.css` - 全局樣式（含設計系統）

### API 路由
- ✅ `app/api/products/route.js` - 產品 CRUD API
- ✅ `app/api/inventory/route.js` - 庫存查詢 API

### 前端頁面
- ✅ `app/page.js` - Dashboard 儀表板
- ✅ `app/products/page.js` - 產品主檔管理
- ✅ `app/inventory/page.js` - 庫存查詢

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

建立 `.env` 檔案：

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/erp_inventory?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3. 設定資料庫

#### 選項 A: 使用 SQL 檔案

```bash
# 連接到 PostgreSQL
psql -U postgres

# 建立資料庫
CREATE DATABASE erp_inventory;

# 執行 Schema
\i database/schema.sql
```

#### 選項 B: 使用 Prisma

```bash
# 產生 Prisma Client
npm run db:generate

# 推送 Schema 到資料庫
npm run db:push

# 或使用 Migration
npm run db:migrate
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 http://localhost:3000 查看應用程式

## 📊 資料庫結構

### 主資料層
- `products` - 產品主檔
- `suppliers` - 廠商資料
- `customers` - 客戶資料

### 交易層
- `purchase_masters` - 進貨主檔
- `purchase_details` - 進貨明細
- `sales_masters` - 銷貨主檔
- `sales_details` - 銷貨明細

### 財務層
- `payments` - 付款紀錄

### 庫存層
- `inventory` - 即時庫存（含自動計算欄位）

### 分析層
- `price_history` - 歷史價格
- `price_comparisons` - 比價分析
- `department_expenses` - 部門支出
- `dashboard_data` - 儀表板資料

### 資料庫特性

✅ **自動觸發器**：
- 進貨時自動更新庫存
- 銷貨時自動更新庫存
- 自動記錄歷史價格

✅ **Generated Column**：
- 現存量自動計算：`current_qty = beginning_qty + purchase_qty - sales_qty`

✅ **視圖 (Views)**：
- `accounts_receivable` - 應收帳款報表
- `inventory_overview` - 庫存總覽
- `monthly_dashboard` - 月度儀表板

## 🔧 技術棧

| 層級 | 技術 | 用途 |
|------|------|------|
| 前端 | Next.js 14 | React 框架 |
| 樣式 | Tailwind CSS | 響應式設計 |
| 後端 | Next.js API Routes | RESTful API |
| ORM | Prisma | 資料庫操作 |
| 資料庫 | PostgreSQL | 關聯式資料庫 |
| 查詢 | React Query | 前端資料管理 |

## 📋 待完成項目

### API 路由
- [ ] `app/api/suppliers/route.js` - 廠商 API
- [ ] `app/api/customers/route.js` - 客戶 API
- [ ] `app/api/purchases/route.js` - 進貨 API
- [ ] `app/api/sales/route.js` - 銷貨 API
- [ ] `app/api/payments/route.js` - 付款 API
- [ ] `app/api/dashboard/route.js` - 儀表板 API

### 前端頁面
- [ ] `app/purchasing/page.js` - 進貨管理頁面
- [ ] `app/sales/page.js` - 銷貨管理頁面
- [ ] `app/analytics/page.js` - 決策分析頁面
- [ ] `app/finance/page.js` - 財務對帳頁面

### 認證系統
- [ ] `lib/auth.js` - NextAuth 設定
- [ ] `app/api/auth/[...nextauth]/route.js` - 認證路由
- [ ] 登入頁面
- [ ] 使用者管理

### 進階功能
- [ ] 圖表整合（使用 Recharts）
- [ ] 數據匯出功能
- [ ] 權限管理
- [ ] 資料備份與還原

## 🎨 設計系統

所有頁面遵循既定的設計系統：

### 顏色
```css
Primary Blue: #2196F3
Success Green: #4CAF50
Warning Orange: #FF9800
Error Red: #F44336
Background: #F5F5F5
```

### 字體
- H1: 24px Bold
- H2: 20px Semibold
- Body: 16px Regular
- Caption: 14px Regular

## 🚀 部署選項

### Vercel（推薦）

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel

# 設定環境變數在 Vercel Dashboard
```

### Docker

建立 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 雲端資料庫

建議使用：
- Supabase（PostgreSQL）
- Neon（PostgreSQL）
- Railway（PostgreSQL + Hosting）

## 📚 相關文件

- [專案文件](./openspec/project.md)
- [變更提案](./openspec/changes/initial-inventory-system/proposal.md)
- [UI 設計](./openspec/changes/initial-inventory-system/ui-design.md)
- [設計文件](./openspec/changes/initial-inventory-system/design.md)

## 🎯 下一步

1. ✅ 資料庫 Schema 已建立
2. ✅ 基礎 API 已建立
3. ✅ Dashboard 頁面已建立
4. ✅ 產品管理頁面已建立
5. ⏭️ 繼續建立其他 API 和頁面
6. ⏭️ 實作認證系統
7. ⏭️ 整合圖表功能
8. ⏭️ 部署到生產環境

## 🆘 疑難排解

### 資料庫連接問題

```bash
# 檢查 PostgreSQL 是否運行
pg_isready

# 檢查連線字串
echo $DATABASE_URL
```

### Prisma 問題

```bash
# 重新產生 Client
npm run db:generate

# 重新啟動 Prisma Studio
npm run db:studio
```

### Next.js 問題

```bash
# 清除快取
rm -rf .next

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

---

**恭喜！** 您的進銷存系統已成功轉換為現代化的 Web 應用程式！🎉


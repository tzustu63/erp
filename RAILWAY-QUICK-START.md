# Railway 快速部署指南

## 🚀 已完成的準備工作

✅ **GitHub Repository**: https://github.com/tzustu63/erp  
✅ **程式碼**: 已成功推送 (79 個檔案, 17,000+ 行程式碼)  
✅ **部署設定**: `railway.json` 已創建  
✅ **PORT 設定**: 已更新 `package.json`

---

## 📋 Railway 部署步驟

### ⚠️ 重要提醒

**部署順序很重要！**

1. ✅ 先添加 PostgreSQL 資料庫服務
2. ✅ 複製 `DATABASE_URL` 到應用程式變數
3. ✅ 然後再部署或重新部署應用程式

**如果直接部署沒有先設定資料庫，會出現 `DATABASE_URL` 錯誤！**

---

### 方法 1: 使用 Web Dashboard（最簡單）

#### 步驟 1: 開啟 Railway

```
https://railway.app
```

#### 步驟 2: 登入並創建專案

1. 點擊 "Login" → 選擇 "Login with GitHub"
2. 授權 Railway 存取您的 GitHub 帳號
3. 點擊 "New Project"
4. 選擇 "Deploy from GitHub repo"
5. 找到並選擇 `tzustu63/erp`

#### 步驟 3: ⚠️ 重要！先添加資料庫

**必須在部署前先添加資料庫！**

1. 點擊專案中的 **"New"** 按鈕
2. 選擇 **"Database"** → **"PostgreSQL"**
3. Railway 會自動創建並提供連線資訊
4. 等待資料庫服務啟動完成（約 30 秒）

#### 步驟 4: 連接資料庫變數

1. 點擊 **PostgreSQL 服務**
2. 切換到 **"Variables"** 標籤
3. 找到並複製 `DATABASE_URL` 的值
4. 回到 **應用程式服務** → **"Settings"** → **"Variables"**
5. 點擊 **"New Variable"**
6. **Key** 填入：`DATABASE_URL`
7. **Value** 貼上剛才複製的連線字串
8. 點擊 **"Add"**
9. 重新部署應用程式（點擊應用程式服務 → **"Deployments"** → **"Redeploy"**）

#### 步驟 5: 等待部署

- Railway 會自動：
  1. 偵測 Next.js 專案
  2. 執行 `npm install`
  3. 執行 `npm run build`
  4. 執行 `npm run db:generate`（產生 Prisma Client）
  5. 執行 `npm run db:push`（初始化資料庫）
  6. 執行 `npm start`
- 部署時間約 3-5 分鐘

#### 步驟 6: 取得網址

1. 部署完成後，點擊應用程式服務
2. 在 "Settings" → "Networking"
3. 點擊 "Generate Domain"
4. 複製網址並訪問

#### 步驟 7: 驗證資料庫初始化

✅ **資料庫會自動初始化！**  
系統會在部署時自動執行 `prisma db push`，建立所有必要的資料表。

如果自動初始化失敗，應用程式會自動切換到**模擬資料模式**，確保系統正常運作。

> **注意**: 為了讓應用程式在沒有資料庫的情況下也能正常運行，系統已內建模擬資料功能。

---

### 方法 2: 使用 Railway CLI

#### 步驟 1: 安裝 CLI

```bash
npm i -g @railway/cli
```

#### 步驟 2: 登入

```bash
railway login
```

（會開啟瀏覽器登入）

#### 步驟 3: 在專案目錄初始化

```bash
cd /Users/tzustu/Desktop/程式開發/erp
railway init
```

#### 步驟 4: 添加 PostgreSQL

```bash
railway add postgresql
```

#### 步驟 5: 設定環境變數

Railway 會自動設定 `DATABASE_URL`，您可以檢查：

```bash
railway variables
```

#### 步驟 6: 部署

```bash
railway up
```

#### 步驟 7: 開啟服務

```bash
railway open
```

---

## 🗄️ 資料庫初始化

### 重要！部署後必須執行

您的系統使用模擬資料，但為了生產環境，需要初始化資料庫：

```bash
# 在 Railway Terminal 中執行
psql $DATABASE_URL -f database/schema.sql
```

或使用 Prisma：

```bash
railway run npm run db:push
```

---

## 🔧 環境變數清單

Railway 會自動設定的變數：

- `DATABASE_URL` (PostgreSQL)
- `PORT` (應用程式埠)
- `NODE_ENV=production`

如果需要額外的變數，可以在 Settings → Variables 中手動添加。

---

## 🎯 驗證部署

### 1. 檢查部署狀態

- 在 Railway Dashboard 查看服務狀態
- 應該是綠色（運行中）

### 2. 查看日誌

- 點擊服務 → Logs
- 檢查是否有錯誤訊息

### 3. 測試功能

訪問您的網址並測試：

- ✅ Dashboard 頁面正常顯示
- ✅ 產品管理功能
- ✅ 進貨單新增
- ✅ 銷貨單新增
- ✅ 庫存查詢
- ✅ 分析報表

---

## 🚨 疑難排解

### 建置失敗

**查看日誌** → 尋找錯誤訊息  
**常見原因**:

- Node.js 版本不相容
- 依賴安裝失敗
- 環境變數未設定

### 資料庫連線錯誤

1. 檢查 `DATABASE_URL` 是否正確設定
2. 確認 PostgreSQL 服務正在運行
3. 檢查防火牆設定

### 應用程式無法啟動

1. 檢查 PORT 設定
2. 查看應用程式日誌
3. 確認建置成功

### 頁面空白或錯誤

1. 確認資料庫 Schema 已執行
2. 檢查 Prisma Client 是否生成
3. 查看瀏覽器 Console 錯誤

### DATABASE_URL 錯誤

如果看到錯誤訊息：
```
Error: Environment variable not found: DATABASE_URL
```

**解決方法**：

1. ✅ 確認已添加 PostgreSQL 資料庫服務
2. ✅ 確認資料庫服務已啟動（綠色）
3. ✅ 確認已複製 `DATABASE_URL` 到應用程式變數
4. ✅ 在應用程式 "Settings" → "Variables" 檢查是否存在
5. ✅ 重新部署應用程式（Deployments → Redeploy）

**注意**：即使沒有資料庫，應用程式也會自動切換到模擬資料模式，確保基本功能可用。

---

## 📞 需要幫助？

### Railway 文件

- https://docs.railway.app
- https://docs.railway.app/guides/node-js

### Railway 支援

- Discord: https://discord.gg/railway
- Email: support@railway.app

---

## ✅ 部署檢查清單

部署完成後，請確認：

- [ ] 應用程式服務顯示綠色（運行中）
- [ ] PostgreSQL 服務顯示綠色
- [ ] 取得 `.railway.app` 網址
- [ ] 可以訪問 Dashboard 頁面
- [ ] API 端點正常回應
- [ ] 資料庫 Schema 已執行
- [ ] 測試所有功能模組
- [ ] 設定自訂網域（如需要）

---

**準備就緒！前往 Railway 開始部署吧！** 🚂

**Railway 網址**: https://railway.app  
**您的專案**: https://github.com/tzustu63/erp

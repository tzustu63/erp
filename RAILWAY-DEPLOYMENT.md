# Railway 部署指南

## 🚂 部署到 Railway

您的程式碼已經成功推送到 GitHub：`git@github.com:tzustu63/erp.git`

---

## 📋 部署步驟

### 方式 1: 透過 Railway Dashboard（推薦）

1. **登入 Railway**
   - 前往 https://railway.app
   - 使用 GitHub 帳號登入

2. **創建新專案**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 授權 Railway 存取您的 GitHub

3. **選擇倉庫**
   - 選擇 `tzustu63/erp`
   - 點擊 "Deploy Now"

4. **設定環境變數**（重要！）
   在 Settings → Variables 加入以下變數：
   ```
   DATABASE_URL=postgresql://...
   PORT=3000
   NODE_ENV=production
   ```

5. **創建 PostgreSQL 資料庫**
   - 點擊 "New" → "Database" → "PostgreSQL"
   - Railway 會自動生成 `DATABASE_URL`
   - 複製這個 URL 到環境變數中

6. **建置與部署**
   - Railway 會自動偵測 Next.js 專案
   - 自動執行 `npm install` 和 `npm run build`
   - 部署完成後會提供一個 `.railway.app` 網址

---

### 方式 2: 使用 Railway CLI

1. **安裝 Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **登入 Railway**
   ```bash
   railway login
   ```

3. **連接專案**
   ```bash
   railway link
   ```

4. **創建資料庫**
   ```bash
   railway add postgresql
   ```

5. **設定環境變數**
   ```bash
   railway variables set NODE_ENV=production
   ```

6. **部署**
   ```bash
   railway up
   ```

---

## ⚙️ 重要設定

### 環境變數

在 Railway Dashboard 的 Variables 設定：

```
DATABASE_URL=<Railway 自動產生的 PostgreSQL URL>
PORT=3000
NODE_ENV=production
```

### 建置設定

Railway 會自動偵測 `package.json`，無需額外設定。

如果需要自訂建置指令，可以在 `railway.json` 中設定：
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

---

## 🗄️ 資料庫設定

### 自動設定（推薦）

Railway 的 PostgreSQL 服務會自動：
1. 創建資料庫
2. 提供 `DATABASE_URL` 環境變數
3. 自動連接到應用程式

### 手動執行 Schema

如果需要執行 SQL Schema：

1. **取得連線資訊**
   - 在 Railway Dashboard 找到 PostgreSQL 服務
   - 點擊 "Connect" 查看連線資訊

2. **執行 Schema**
   ```bash
   # 從本機連接到 Railway 資料庫
   psql -h <railway-host> -U <user> -d <database> -f database/schema.sql
   ```

或使用 Prisma：
```bash
railway run npm run db:push
```

---

## 🔍 檢查部署狀態

1. **查看 Logs**
   - 在 Railway Dashboard 點擊 "Logs"
   - 檢查建置和部署日誌

2. **檢查服務狀態**
   - 綠色 = 運行中
   - 紅色 = 有錯誤

3. **測試網址**
   - 點擊服務的網址
   - 應該看到 Dashboard 頁面

---

## 🚨 常見問題

### 問題 1: 建置失敗

**可能原因**: Node.js 版本不支援

**解決方法**: 在 `package.json` 加入：
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 問題 2: 資料庫連線錯誤

**可能原因**: 環境變數未設定

**解決方法**: 
1. 檢查 Railway Variables 是否有 `DATABASE_URL`
2. 確保值正確（包含帳號、密碼、host、port）

### 問題 3: 應用程式無法啟動

**可能原因**: PORT 環境變數

**解決方法**: Railway 會自動設定 PORT，使用 `${PORT}` 變數

已更新的 `package.json`:
```json
{
  "start": "next start -p ${PORT:-3000}"
}
```

### 問題 4: 頁面顯示空白

**可能原因**: Prisma Client 未生成

**解決方法**: 在 Railway 建置指令中執行：
```bash
npm run db:generate && npm run build
```

---

## 📊 監控與維護

### 查看日誌
```bash
railway logs
```

### 查看服務狀態
在 Railway Dashboard 的 "Metrics" 查看：
- CPU 使用率
- 記憶體使用率
- 網路流量

### 更新應用程式

每次推送新的 commit 到 GitHub，Railway 會自動重新部署。

---

## 💰 費用

Railway 免費方案提供：
- $5 免費額度/月
- 足夠小到中型應用程式使用

如需更多資源，可以升級方案。

---

## 🎉 部署完成後

1. ✅ 測試所有功能頁面
2. ✅ 檢查 API 是否正常運作
3. ✅ 測試資料庫連線
4. ✅ 設定自訂網域（如需要）

---

## 📝 快速檢查清單

- [ ] GitHub 倉庫已推送程式碼
- [ ] Railway 專案已創建
- [ ] PostgreSQL 資料庫已創建
- [ ] 環境變數已設定
- [ ] 建置成功無錯誤
- [ ] 應用程式正常運行
- [ ] 資料庫 Schema 已執行
- [ ] 功能測試通過

---

**恭喜！您的進銷存系統已部署到 Railway！** 🚂🎉


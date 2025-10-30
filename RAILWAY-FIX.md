# Railway DATABASE_URL 錯誤修復指南

## 🐛 問題

看到錯誤：
```
Error: Environment variable not found: DATABASE_URL
```

## ✅ 解決步驟

### 步驟 1: 添加 PostgreSQL 資料庫

1. 在 Railway Dashboard 中，點擊專案的 **"New"** 按鈕
2. 選擇 **"Database"** → **"PostgreSQL"**
3. 等待資料庫服務啟動（約 30 秒）

### 步驟 2: 複製 DATABASE_URL

1. 點擊 **PostgreSQL 服務**
2. 切換到 **"Variables"** 標籤
3. 找到 **`DATABASE_URL`** 並複製完整連線字串

範例格式：
```
postgresql://postgres:PASSWORD@HOST:5432/railway?sslmode=require
```

### 步驟 3: 設定應用程式變數

1. 回到 **應用程式服務**
2. 點擊 **"Settings"** → **"Variables"**
3. 點擊 **"New Variable"**
4. **Key**: `DATABASE_URL`
5. **Value**: 貼上剛才複製的連線字串
6. 點擊 **"Add"**

### 步驟 4: 重新部署

1. 點擊 **"Deployments"** 標籤
2. 點擊 **"Redeploy"** 或 **"Deploy Latest"**
3. 等待部署完成

## 🎯 完成！

部署成功後，資料庫會自動初始化，所有功能都會正常運作。

如果還有問題，應用程式會自動切換到**模擬資料模式**，確保基本功能可用。

## 📚 詳細文件

查看 `RAILWAY-QUICK-START.md` 獲取完整部署指南。

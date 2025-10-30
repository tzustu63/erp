# Railway 手動部署指南

## ⚠️ 如果看到 DATABASE_URL 錯誤

Railway 可能還在進行舊的部署。請按照以下步驟手動重新部署：

## 📋 步驟

### 1. 確認 GitHub 更新

首先確認最新程式碼已推送到 GitHub：

```bash
git log --oneline -3
```

應該看到：
```
bffadf1 fix: 修正安全啟動腳本避免循環調用
9b27318 fix: 實作安全啟動腳本，避免 DATABASE_URL 錯誤
8ebd025 docs: 新增 Railway DATABASE_URL 錯誤快速修復指南
```

### 2. 在 Railway Dashboard 重新部署

1. 登入 https://railway.app
2. 選擇您的專案
3. 點擊應用程式服務
4. 切換到 **"Deployments"** 標籤
5. 找到最新的部署
6. 點擊 **"..."** 選單
7. 選擇 **"Redeploy"**

### 3. 檢查部署日誌

重新部署後，應該看到：

```
🚀 開始 Railway 部署流程...
📊 產生 Prisma Client...
✔ Generated Prisma Client
⚠️  DATABASE_URL 不存在，跳過資料庫初始化
ℹ️  應用程式將使用模擬資料模式
🚀 啟動應用程式...
```

### 4. 驗證應用程式

部署完成後：

1. 點擊 **"Settings"** → **"Networking"**
2. 找到生成的網址（例如：`xxx.railway.app`）
3. 在瀏覽器訪問
4. 應該看到 Dashboard 頁面

## 🎯 成功指標

✅ **成功**：看到 Dashboard 頁面，功能正常運作  
❌ **失敗**：仍然看到 DATABASE_URL 錯誤

## 🔄 如果仍然失敗

如果重新部署後仍然失敗：

### 檢查 1: railway.json 文件

確認 Railway 使用的 `railway.json` 內容：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "node scripts/safe-start.js"
  }
}
```

### 檢查 2: scripts/safe-start.js 存在

確認 `scripts/safe-start.js` 文件存在且可執行：

```bash
ls -la scripts/safe-start.js
```

### 檢查 3: 清除快取

如果問題持續，嘗試清除 Railway 建置快取：

1. 在 Railway Dashboard
2. 點擊應用程式服務
3. Settings → Danger Zone
4. Clear Build Cache
5. 重新部署

## 📚 更多資訊

查看其他文件獲取更多說明：

- `RAILWAY-NEXT-STEPS.md` - 部署下一步
- `RAILWAY-QUICK-START.md` - 完整部署指南
- `scripts/safe-start.js` - 安全啟動腳本

---

**如果仍有問題，請檢查 Railway 部署日誌獲取詳細錯誤訊息。**

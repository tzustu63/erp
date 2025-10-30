#!/bin/bash
# Railway 啟動腳本

echo "🚀 開始 Railway 部署流程..."

# 產生 Prisma Client
echo "📊 產生 Prisma Client..."
npx prisma generate || echo "⚠️  Prisma generate 失敗，將繼續"

# 推送資料庫 Schema
echo "🗄️  初始化資料庫..."
npx prisma db push --accept-data-loss || echo "⚠️  資料庫初始化失敗，將使用模擬資料"

# 啟動應用程式
echo "🚀 啟動應用程式..."
npm start


#!/bin/bash
# 安全啟動腳本 - 只有在 DATABASE_URL 存在時才初始化資料庫

echo "🚀 開始 Railway 部署流程..."

# 產生 Prisma Client
echo "📊 產生 Prisma Client..."
npx prisma generate || echo "⚠️  Prisma generate 失敗，將繼續"

# 檢查 DATABASE_URL 是否存在
if [ -n "$DATABASE_URL" ]; then
  echo "🗄️  DATABASE_URL 存在，開始初始化資料庫..."
  npx prisma db push --accept-data-loss || echo "⚠️  資料庫初始化失敗，將使用模擬資料"
else
  echo "⚠️  DATABASE_URL 不存在，跳過資料庫初始化"
  echo "ℹ️  應用程式將使用模擬資料模式"
fi

# 啟動應用程式
echo "🚀 啟動應用程式..."
npm start


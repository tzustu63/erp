#!/usr/bin/env node
/**
 * 安全啟動腳本 - 只有在 DATABASE_URL 存在時才初始化資料庫
 */

const { execSync } = require('child_process');

console.log('🚀 開始 Railway 部署流程...');

try {
  // 產生 Prisma Client
  console.log('📊 產生 Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Prisma generate 失敗，將繼續');
}

// 檢查 DATABASE_URL 是否存在
if (process.env.DATABASE_URL) {
  console.log('🗄️  DATABASE_URL 存在，開始初始化資料庫...');
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  資料庫初始化失敗，將使用模擬資料');
  }
} else {
  console.log('⚠️  DATABASE_URL 不存在，跳過資料庫初始化');
  console.log('ℹ️  應用程式將使用模擬資料模式');
}

// 啟動應用程式
console.log('🚀 啟動應用程式...');
try {
  // 讓 Next.js 自動處理 PORT（Railway 會自動設定 PORT 環境變數）
  execSync('next start', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 應用程式啟動失敗:', error.message);
  process.exit(1);
}


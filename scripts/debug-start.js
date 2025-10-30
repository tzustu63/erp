#!/usr/bin/env node
/**
 * 除錯啟動腳本 - 顯示詳細資訊並啟動應用程式
 */

const { execSync } = require('child_process');

console.log('🔍 環境資訊：');
console.log('PORT:', process.env.PORT || '未設定');
console.log('NODE_ENV:', process.env.NODE_ENV || '未設定');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '已設定' : '未設定');
console.log('');

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
console.log('Port:', process.env.PORT || '3000');
console.log('');

try {
  execSync('next start', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 應用程式啟動失敗:', error.message);
  process.exit(1);
}


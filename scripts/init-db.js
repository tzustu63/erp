/**
 * 資料庫初始化腳本
 * 在 Railway 部署後自動執行
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 開始初始化資料庫...');

try {
  // 執行 Prisma 初始化
  console.log('📊 產生 Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('🗄️  推送 Schema 到資料庫...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

  console.log('✅ 資料庫初始化完成！');
} catch (error) {
  console.error('❌ 資料庫初始化失敗:', error.message);
  console.log('ℹ️  將繼續使用模擬資料模式');
  // 不終止程序，讓應用程式繼續運行
}


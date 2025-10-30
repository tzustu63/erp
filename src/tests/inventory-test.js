/**
 * 庫存服務測試
 * 任務 7: 資料驗證與測試
 */

import { 
  updateInventoryOnPurchase, 
  updateInventoryOnSales, 
  calculateCurrentQuantity,
  checkInventoryAlert 
} from '../services/inventory-service.js';

// 任務 7.3: 測試進貨單新增後庫存正確增加
export async function testInventoryIncrease() {
  console.log('測試：進貨後庫存增加');
  
  const productId = 1;
  const quantity = 100;
  const date = new Date();
  
  try {
    const result = await updateInventoryOnPurchase(productId, quantity, date);
    
    console.assert(result.PurchaseQty === 100, '進貨量應為 100');
    console.assert(result.CurrentQty === 100, '現存量應為 100');
    
    console.log('✅ 測試通過：進貨後庫存正確增加');
  } catch (error) {
    console.error('❌ 測試失敗：', error);
  }
}

// 任務 7.4: 測試銷貨單新增後庫存正確減少
export async function testInventoryDecrease() {
  console.log('測試：銷貨後庫存減少');
  
  const productId = 1;
  const quantity = 50;
  
  try {
    const result = await updateInventoryOnSales(productId, quantity);
    
    console.assert(result.SalesQty === 50, '銷貨量應為 50');
    console.assert(result.CurrentQty === 50, '現存量應為 50');
    
    console.log('✅ 測試通過：銷貨後庫存正確減少');
  } catch (error) {
    console.error('❌ 測試失敗：', error);
  }
}

// 測試現存量計算公式
export function testCurrentQuantityFormula() {
  console.log('測試：現存量計算公式');
  
  const inventory = {
    BeginningQty: 50,
    PurchaseQty: 100,
    SalesQty: 80
  };
  
  const currentQty = calculateCurrentQuantity(inventory);
  
  console.assert(currentQty === 70, '現存量應為 70 (50 + 100 - 80)');
  console.log('✅ 測試通過：現存量計算正確');
}

// 測試庫存不足警示
export async function testInventoryAlert() {
  console.log('測試：庫存不足警示');
  
  const productId = 1;
  const minStock = 10;
  
  try {
    const result = await checkInventoryAlert(productId, minStock);
    
    if (result.alert) {
      console.log('⚠️  庫存警示：', result.message);
    } else {
      console.log('✅ 庫存充足');
    }
    
    console.log('✅ 測試通過：庫存警示功能正常');
  } catch (error) {
    console.error('❌ 測試失敗：', error);
  }
}

// 執行所有測試
export async function runAllTests() {
  console.log('========== 執行庫存服務測試 ==========\n');
  
  testCurrentQuantityFormula();
  console.log('');
  
  await testInventoryIncrease();
  console.log('');
  
  await testInventoryDecrease();
  console.log('');
  
  await testInventoryAlert();
  console.log('');
  
  console.log('========== 測試完成 ==========');
}


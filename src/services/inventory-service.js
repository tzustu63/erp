/**
 * 庫存服務
 * 處理庫存的自動更新邏輯
 */

/**
 * 更新庫存（進貨）
 * @param {number} productId - 產品 ID
 * @param {number} quantity - 進貨數量
 * @param {Date} date - 進貨日期
 * @returns {Object} 更新後的庫存資訊
 */
export async function updateInventoryOnPurchase(productId, quantity, date) {
  // 任務 5.4: 實作進貨自動更新庫存機制（進貨量 +）
  const inventory = await getInventory(productId);
  
  const updatedInventory = {
    ...inventory,
    PurchaseQty: inventory.PurchaseQty + quantity,
    CurrentQty: inventory.BeginningQty + (inventory.PurchaseQty + quantity) - inventory.SalesQty
  };
  
  // 更新庫存記錄
  await updateInventory(updatedInventory);
  
  // 記錄歷史價格
  await recordPriceHistory(productId, quantity, date);
  
  return updatedInventory;
}

/**
 * 更新庫存（銷貨）
 * @param {number} productId - 產品 ID
 * @param {number} quantity - 銷貨數量
 * @returns {Object} 更新後的庫存資訊
 */
export async function updateInventoryOnSales(productId, quantity) {
  // 任務 5.5: 實作銷貨自動更新庫存機制（銷貨量 +）
  const inventory = await getInventory(productId);
  
  // 檢查庫存是否足夠
  if (inventory.CurrentQty < quantity) {
    throw new Error(`庫存不足！現有庫存：${inventory.CurrentQty}，需求：${quantity}`);
  }
  
  const updatedInventory = {
    ...inventory,
    SalesQty: inventory.SalesQty + quantity,
    CurrentQty: inventory.BeginningQty + inventory.PurchaseQty - (inventory.SalesQty + quantity)
  };
  
  // 更新庫存記錄
  await updateInventory(updatedInventory);
  
  return updatedInventory;
}

/**
 * 取得庫存資訊
 * @param {number} productId - 產品 ID
 * @returns {Object} 庫存資訊
 */
export async function getInventory(productId) {
  // 任務 5.1: 建立即時庫存工作表 (50_Inventory)
  // 這裡會從資料庫或 Excel 讀取庫存資料
  // 範例實作
  return {
    ID: 1,
    ProductID: productId,
    BeginningQty: 0,
    PurchaseQty: 0,
    SalesQty: 0,
    CurrentQty: 0
  };
}

/**
 * 更新庫存記錄
 * @param {Object} inventory - 庫存資料
 */
async function updateInventory(inventory) {
  // 更新庫存到資料庫或 Excel
  console.log('更新庫存:', inventory);
}

/**
 * 記錄歷史價格
 * @param {number} productId - 產品 ID
 * @param {number} quantity - 數量
 * @param {Date} date - 日期
 */
async function recordPriceHistory(productId, quantity, date) {
  // 任務 6.3: 實作進貨時自動記錄歷史價格
  console.log('記錄歷史價格:', { productId, quantity, date });
}

/**
 * 計算現存量
 * @param {Object} inventory - 庫存資料
 * @returns {number} 現存量
 */
export function calculateCurrentQuantity(inventory) {
  // 任務 5.6: 實作現存量自動計算公式（期初 + 進貨 - 銷貨）
  return inventory.BeginningQty + inventory.PurchaseQty - inventory.SalesQty;
}

/**
 * 檢查庫存不足警示
 * @param {number} productId - 產品 ID
 * @param {number} minStock - 安全庫存量
 * @returns {Object} 警示資訊
 */
export async function checkInventoryAlert(productId, minStock = 10) {
  const inventory = await getInventory(productId);
  
  if (inventory.CurrentQty < minStock) {
    return {
      alert: true,
      message: `庫存不足警示！產品 ID: ${productId}，現有庫存：${inventory.CurrentQty}，安全庫存：${minStock}`,
      currentQty: inventory.CurrentQty,
      minStock: minStock
    };
  }
  
  return { alert: false };
}


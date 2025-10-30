/**
 * 進貨服務
 * 處理進貨單的建立與管理
 */

/**
 * 建立進貨單
 * @param {Object} purchaseData - 進貨單資料
 * @returns {Object} 建立的進貨單
 */
export async function createPurchaseOrder(purchaseData) {
  // 任務 2.1: 建立進貨主檔工作表 (20_PurchaseMaster)
  const {
    supplierId,
    date,
    status = '待入庫',
    items // 進貨明細
  } = purchaseData;
  
  // 產生進貨單號
  const purchaseNo = await generatePurchaseNo();
  
  // 計算總金額和稅額
  const { subtotal, tax, total } = calculatePurchaseTotal(items);
  
  const purchaseMaster = {
    PurchaseNo: purchaseNo,
    SupplierID: supplierId,
    Date: date,
    Amount: total,
    Tax: tax,
    Status: status
  };
  
  // 建立進貨主檔
  const purchaseId = await savePurchaseMaster(purchaseMaster);
  
  // 建立進貨明細
  const details = await createPurchaseDetails(purchaseId, items);
  
  // 如果狀態為「已入庫」，自動更新庫存
  if (status === '已入庫') {
    for (const item of items) {
      await updateInventoryOnPurchase(item.productId, item.quantity, date);
    }
  }
  
  return {
    ...purchaseMaster,
    ID: purchaseId,
    details: details
  };
}

/**
 * 產生進貨單號
 * @returns {string} 進貨單號
 */
async function generatePurchaseNo() {
  // 產生格式：PUR-YYYYMMDD-001
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  // 取得當日序號
  const sequence = await getPurchaseSequence(year + month + day);
  
  return `PUR-${year}${month}${day}-${String(sequence).padStart(3, '0')}`;
}

/**
 * 建立進貨明細
 * @param {number} purchaseId - 進貨主檔 ID
 * @param {Array} items - 明細項目
 * @returns {Array} 建立的明細
 */
async function createPurchaseDetails(purchaseId, items) {
  // 任務 2.3: 建立進貨明細工作表 (21_PurchaseDetails)
  const details = [];
  
  for (const item of items) {
    const detail = {
      PurchaseID: purchaseId,
      ProductID: item.productId,
      Quantity: item.quantity,
      UnitPrice: item.unitPrice,
      SubTotal: item.quantity * item.unitPrice
    };
    
    const detailId = await savePurchaseDetail(detail);
    details.push({ ...detail, ID: detailId });
    
    // 任務 2.4: 自動更新對應產品的歷史價格
    await recordHistoricalPrice(item.productId, item.unitPrice);
  }
  
  return details;
}

/**
 * 計算進貨總額
 * @param {Array} items - 明細項目
 * @returns {Object} 小計、稅額、總額
 */
function calculatePurchaseTotal(items) {
  // 任務 2.6: 實作總金額自動計算公式
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  const tax = subtotal * 0.05; // 5% 稅率
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
}

/**
 * 查詢進貨紀錄
 * @param {Object} filters - 篩選條件
 * @returns {Array} 進貨紀錄列表
 */
export async function queryPurchaseHistory(filters = {}) {
  // 任務 2.5: 查詢進貨紀錄
  const { supplierId, productId, startDate, endDate } = filters;
  
  // 從資料庫查詢
  const purchases = await queryPurchases({
    supplierId,
    productId,
    startDate,
    endDate
  });
  
  return purchases;
}

/**
 * 儲存進貨主檔
 * @param {Object} purchase - 進貨主檔資料
 * @returns {number} 進貨單 ID
 */
async function savePurchaseMaster(purchase) {
  console.log('儲存進貨主檔:', purchase);
  return 1; // 範例 ID
}

/**
 * 儲存進貨明細
 * @param {Object} detail - 明細資料
 * @returns {number} 明細 ID
 */
async function savePurchaseDetail(detail) {
  console.log('儲存進貨明細:', detail);
  return 1; // 範例 ID
}

/**
 * 記錄歷史價格
 * @param {number} productId - 產品 ID
 * @param {number} unitPrice - 單價
 */
async function recordHistoricalPrice(productId, unitPrice) {
  // 任務 6.3: 實作進貨時自動記錄歷史價格
  console.log('記錄歷史價格:', { productId, unitPrice, date: new Date() });
}

/**
 * 取得進貨序號
 * @param {string} date - 日期字串 YYYYMMDD
 * @returns {number} 序號
 */
async function getPurchaseSequence(date) {
  // 查詢當日已有的進貨單數量
  return 1; // 範例序號
}

/**
 * 查詢進貨單
 * @param {Object} filters - 篩選條件
 * @returns {Array} 進貨單列表
 */
async function queryPurchases(filters) {
  // 從資料庫或 Excel 查詢
  return [];
}

// 匯入庫存服務
import { updateInventoryOnPurchase } from './inventory-service.js';


/**
 * 銷貨服務
 * 處理銷貨單的建立與管理
 */

/**
 * 建立銷貨單
 * @param {Object} salesData - 銷貨單資料
 * @returns {Object} 建立的銷貨單
 */
export async function createSalesOrder(salesData) {
  // 任務 3.1: 建立銷貨主檔工作表 (30_SalesMaster)
  const {
    customerId,
    date,
    invoiceNo,
    invoiceDate,
    status = '待出貨',
    items // 銷貨明細
  } = salesData;
  
  // 檢查客戶信用額度
  await checkCreditLimit(customerId, items);
  
  // 產生銷貨單號
  const salesNo = await generateSalesNo();
  
  // 計算總金額和稅額
  const { subtotal, tax, total } = calculateSalesTotal(items);
  
  const salesMaster = {
    SalesNo: salesNo,
    CustomerID: customerId,
    Date: date,
    Amount: total,
    Tax: tax,
    InvoiceNo: invoiceNo,
    InvoiceDate: invoiceDate,
    Status: status
  };
  
  // 建立銷貨主檔
  const salesId = await saveSalesMaster(salesMaster);
  
  // 建立銷貨明細
  const details = await createSalesDetails(salesId, items);
  
  // 如果狀態為「已出貨」，自動更新庫存
  if (status === '已出貨') {
    for (const item of items) {
      await updateInventoryOnSales(item.productId, item.quantity);
    }
  }
  
  return {
    ...salesMaster,
    ID: salesId,
    details: details
  };
}

/**
 * 檢查客戶信用額度
 * @param {number} customerId - 客戶 ID
 * @param {Array} items - 銷貨明細
 * @throws {Error} 如果超出信用額度
 */
async function checkCreditLimit(customerId, items) {
  // 任務 3.7: 檢查信用額度
  const customer = await getCustomer(customerId);
  const totalAmount = calculateSalesTotal(items).total;
  
  // 取得目前應收帳款
  const currentReceivable = await getAccountsReceivable(customerId);
  
  // 檢查是否超出信用額度
  if (currentReceivable + totalAmount > customer.CreditLimit) {
    throw new Error(`超出信用額度！客戶：${customer.Name}，信用額度：${customer.CreditLimit}，本次金額：${totalAmount}`);
  }
}

/**
 * 產生銷貨單號
 * @returns {string} 銷貨單號
 */
async function generateSalesNo() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const sequence = await getSalesSequence(year + month + day);
  
  return `SAL-${year}${month}${day}-${String(sequence).padStart(3, '0')}`;
}

/**
 * 建立銷貨明細
 * @param {number} salesId - 銷貨主檔 ID
 * @param {Array} items - 明細項目
 * @returns {Array} 建立的明細
 */
async function createSalesDetails(salesId, items) {
  // 任務 3.3: 建立銷貨明細工作表 (31_SalesDetails)
  const details = [];
  
  for (const item of items) {
    // 檢查庫存是否足夠
    await checkInventoryAvailability(item.productId, item.quantity);
    
    const detail = {
      SalesID: salesId,
      ProductID: item.productId,
      Quantity: item.quantity,
      UnitPrice: item.unitPrice,
      SubTotal: item.quantity * item.unitPrice
    };
    
    const detailId = await saveSalesDetail(detail);
    details.push({ ...detail, ID: detailId });
  }
  
  return details;
}

/**
 * 檢查庫存可用性
 * @param {number} productId - 產品 ID
 * @param {number} quantity - 需求數量
 * @throws {Error} 如果庫存不足
 */
async function checkInventoryAvailability(productId, quantity) {
  const inventory = await getInventory(productId);
  
  if (inventory.CurrentQty < quantity) {
    throw new Error(`庫存不足！產品 ID: ${productId}，需求：${quantity}，現有：${inventory.CurrentQty}`);
  }
}

/**
 * 計算銷貨總額
 * @param {Array} items - 明細項目
 * @returns {Object} 小計、稅額、總額、毛利
 */
export function calculateSalesTotal(items) {
  // 任務 3.6: 實作總金額自動計算公式
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
}

/**
 * 計算毛利
 * @param {number} salesAmount - 銷貨金額
 * @param {number} costAmount - 進貨成本
 * @returns {Object} 毛利與毛利率
 */
export function calculateProfitMargin(salesAmount, costAmount) {
  const profit = salesAmount - costAmount;
  const profitMargin = (profit / salesAmount) * 100;
  
  return { profit, profitMargin };
}

/**
 * 儲存銷貨主檔
 * @param {Object} sales - 銷貨主檔資料
 * @returns {number} 銷貨單 ID
 */
async function saveSalesMaster(sales) {
  console.log('儲存銷貨主檔:', sales);
  return 1;
}

/**
 * 儲存銷貨明細
 * @param {Object} detail - 明細資料
 * @returns {number} 明細 ID
 */
async function saveSalesDetail(detail) {
  console.log('儲存銷貨明細:', detail);
  return 1;
}

/**
 * 取得客戶資料
 * @param {number} customerId - 客戶 ID
 * @returns {Object} 客戶資料
 */
async function getCustomer(customerId) {
  return {
    ID: customerId,
    Name: '客戶範例',
    CreditLimit: 100000
  };
}

/**
 * 取得應收帳款
 * @param {number} customerId - 客戶 ID
 * @returns {number} 應收帳款金額
 */
async function getAccountsReceivable(customerId) {
  return 0;
}

/**
 * 取得銷貨序號
 * @param {string} date - 日期字串
 * @returns {number} 序號
 */
async function getSalesSequence(date) {
  return 1;
}

// 匯入所需服務
import { getInventory, updateInventoryOnSales } from './inventory-service.js';


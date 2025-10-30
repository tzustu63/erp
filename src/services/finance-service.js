/**
 * 財務服務
 * 處理付款紀錄與應收帳款管理
 */

/**
 * 建立付款紀錄
 * @param {Object} paymentData - 付款資料
 * @returns {Object} 建立的付款紀錄
 */
export async function createPayment(paymentData) {
  // 任務 4.1: 建立付款紀錄工作表 (40_Payments)
  const {
    salesId,
    paymentNo,
    date,
    paymentMethod,
    amount
  } = paymentData;
  
  // 檢查付款金額是否超過應收款項
  await validatePaymentAmount(salesId, amount);
  
  const payment = {
    SalesID: salesId,
    PaymentNo: paymentNo,
    Date: date,
    PaymentMethod: paymentMethod,
    Amount: amount
  };
  
  const paymentId = await savePayment(payment);
  
  // 檢查是否已完全付款
  await checkPaymentCompletion(salesId);
  
  return { ...payment, ID: paymentId };
}

/**
 * 驗證付款金額
 * @param {number} salesId - 銷貨單 ID
 * @param {number} amount - 付款金額
 * @throws {Error} 如果付款金額超過應收款項
 */
async function validatePaymentAmount(salesId, amount) {
  const receivable = await getAccountsReceivable(salesId);
  
  if (amount > receivable) {
    throw new Error(`付款金額超過應收款項！應收：${receivable}，付款：${amount}`);
  }
}

/**
 * 檢查付款完成狀態
 * @param {number} salesId - 銷貨單 ID
 */
async function checkPaymentCompletion(salesId) {
  const sales = await getSalesMaster(salesId);
  const totalPaid = await getTotalPayments(salesId);
  
  // 任務 4.5: 實作部分付款支援機制
  const status = totalPaid >= sales.Amount ? '已結清' : '部分付款';
  
  await updateSalesStatus(salesId, status);
}

/**
 * 取得應收帳款
 * @param {number} salesId - 銷貨單 ID
 * @returns {number} 應收帳款金額
 */
export async function getAccountsReceivable(salesId) {
  const sales = await getSalesMaster(salesId);
  const totalPaid = await getTotalPayments(salesId);
  
  // 任務 4.4: 實作應收帳款計算邏輯
  return sales.Amount - totalPaid;
}

/**
 * 查詢應收帳款報表
 * @param {Object} filters - 篩選條件
 * @returns {Array} 應收帳款列表
 */
export async function queryReceivableReport(filters = {}) {
  const { customerId, status } = filters;
  
  const salesList = await querySales(customerId);
  const report = [];
  
  for (const sales of salesList) {
    const totalPaid = await getTotalPayments(sales.ID);
    const receivable = sales.Amount - totalPaid;
    
    if (receivable > 0) {
      const paymentStatus = totalPaid >= sales.Amount ? '已結清' : (totalPaid > 0 ? '部分付款' : '未付款');
      
      if (!status || paymentStatus === status) {
        report.push({
          SalesNo: sales.SalesNo,
          CustomerID: sales.CustomerID,
          SalesAmount: sales.Amount,
          PaidAmount: totalPaid,
          ReceivableAmount: receivable,
          Status: paymentStatus
        });
      }
    }
  }
  
  return report;
}

/**
 * 儲存付款紀錄
 * @param {Object} payment - 付款資料
 * @returns {number} 付款 ID
 */
async function savePayment(payment) {
  console.log('儲存付款紀錄:', payment);
  return 1;
}

/**
 * 取得銷貨主檔
 * @param {number} salesId - 銷貨單 ID
 * @returns {Object} 銷貨主檔
 */
async function getSalesMaster(salesId) {
  return {
    ID: salesId,
    Amount: 10000
  };
}

/**
 * 取得總付款金額
 * @param {number} salesId - 銷貨單 ID
 * @returns {number} 總付款金額
 */
async function getTotalPayments(salesId) {
  const payments = await queryPayments(salesId);
  return payments.reduce((sum, payment) => sum + payment.Amount, 0);
}

/**
 * 更新銷貨狀態
 * @param {number} salesId - 銷貨單 ID
 * @param {string} status - 狀態
 */
async function updateSalesStatus(salesId, status) {
  console.log(`更新銷貨單 ${salesId} 狀態為: ${status}`);
}

/**
 * 查詢銷貨單
 * @param {number} customerId - 客戶 ID
 * @returns {Array} 銷貨單列表
 */
async function querySales(customerId) {
  return [];
}

/**
 * 查詢付款紀錄
 * @param {number} salesId - 銷貨單 ID
 * @returns {Array} 付款紀錄列表
 */
async function queryPayments(salesId) {
  return [];
}


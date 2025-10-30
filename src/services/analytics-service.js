/**
 * 分析服務
 * 處理歷史價格、比價、部門支出與儀表板資料
 */

/**
 * 查詢歷史價格趨勢
 * @param {number} productId - 產品 ID
 * @param {Object} dateRange - 日期範圍
 * @returns {Array} 歷史價格列表
 */
export async function queryPriceHistory(productId, dateRange = {}) {
  // 任務 6.1: 建立歷史進貨價格工作表 (60_PriceHistory)
  const { startDate, endDate } = dateRange;
  
  const priceHistory = await queryHistoricalPrices(productId, startDate, endDate);
  
  return priceHistory.sort((a, b) => new Date(a.PurchaseDate) - new Date(b.PurchaseDate));
}

/**
 * 比價分析
 * @param {number} productId - 產品 ID
 * @returns {Array} 不同廠商的價格比較
 */
export async function priceComparison(productId) {
  // 任務 6.4: 建立比價分析來源工作表 (61_PriceComparison)
  const suppliers = await getAllSuppliers();
  const comparison = [];
  
  for (const supplier of suppliers) {
    const latestPrice = await getLatestPrice(productId, supplier.ID);
    
    if (latestPrice) {
      comparison.push({
        SupplierID: supplier.ID,
        SupplierName: supplier.Name,
        UnitPrice: latestPrice.UnitPrice,
        Date: latestPrice.Date
      });
    }
  }
  
  // 排序並標示最低價
  comparison.sort((a, b) => a.UnitPrice - b.UnitPrice);
  comparison[0].isLowest = true;
  
  return comparison;
}

/**
 * 查詢部門支出
 * @param {Object} filters - 篩選條件
 * @returns {Array} 部門支出列表
 */
export async function queryDepartmentExpenses(filters = {}) {
  // 任務 6.6: 建立部門支出來源工作表 (70_DepartmentExpense)
  const { year, month, department } = filters;
  
  return await queryExpenses({ year, month, department });
}

/**
 * 產生月度支出報表
 * @param {number} year - 年度
 * @param {number} month - 月份
 * @returns {Object} 月度支出彙整
 */
export async function generateMonthlyExpenseReport(year, month) {
  const expenses = await queryExpenses({ year, month });
  
  const summary = {
    year,
    month,
    totalAmount: 0,
    totalTax: 0,
    byDepartment: {},
    byCategory: {}
  };
  
  for (const expense of expenses) {
    summary.totalAmount += expense.TotalAmount;
    summary.totalTax += expense.Tax;
    
    // 依部門彙整
    if (!summary.byDepartment[expense.Department]) {
      summary.byDepartment[expense.Department] = 0;
    }
    summary.byDepartment[expense.Department] += expense.TotalAmount;
    
    // 依類別彙整
    if (!summary.byCategory[expense.Category]) {
      summary.byCategory[expense.Category] = 0;
    }
    summary.byCategory[expense.Category] += expense.TotalAmount;
  }
  
  return summary;
}

/**
 * 產生儀表板資料
 * @param {number} year - 年度
 * @param {number} month - 月份
 * @returns {Object} 儀表板 KPI
 */
export async function generateDashboardData(year, month) {
  // 任務 6.8: 建立儀表板資料工作表 (80_DashboardData)
  const dashboard = {
    year,
    month,
    purchaseTotal: await getPurchaseTotal(year, month),
    salesTotal: await getSalesTotal(year, month),
    profit: 0,
    profitMargin: 0
  };
  
  // 計算毛利
  const costs = await getTotalCost(year, month);
  dashboard.profit = dashboard.salesTotal - costs;
  dashboard.profitMargin = dashboard.salesTotal > 0 ? (dashboard.profit / dashboard.salesTotal) * 100 : 0;
  
  // 與上月比較
  const previousMonth = await generateDashboardData(
    month === 1 ? year - 1 : year,
    month === 1 ? 12 : month - 1
  );
  
  dashboard.purchaseGrowth = calculateGrowthRate(dashboard.purchaseTotal, previousMonth.purchaseTotal);
  dashboard.salesGrowth = calculateGrowthRate(dashboard.salesTotal, previousMonth.salesTotal);
  dashboard.profitGrowth = calculateGrowthRate(dashboard.profit, previousMonth.profit);
  
  return dashboard;
}

/**
 * 計算成長率
 * @param {number} current - 當前值
 * @param {number} previous - 前期值
 * @returns {number} 成長率（百分比）
 */
function calculateGrowthRate(current, previous) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * 查詢歷史價格
 * @param {number} productId - 產品 ID
 * @param {Date} startDate - 開始日期
 * @param {Date} endDate - 結束日期
 * @returns {Array} 歷史價格列表
 */
async function queryHistoricalPrices(productId, startDate, endDate) {
  // 從資料庫或 Excel 查詢
  return [];
}

/**
 * 取得所有廠商
 * @returns {Array} 廠商列表
 */
async function getAllSuppliers() {
  return [
    { ID: 1, Name: '廠商A' },
    { ID: 2, Name: '廠商B' }
  ];
}

/**
 * 取得最新價格
 * @param {number} productId - 產品 ID
 * @param {number} supplierId - 廠商 ID
 * @returns {Object} 最新價格資訊
 */
async function getLatestPrice(productId, supplierId) {
  return {
    UnitPrice: 100,
    Date: new Date()
  };
}

/**
 * 查詢支出
 * @param {Object} filters - 篩選條件
 * @returns {Array} 支出列表
 */
async function queryExpenses(filters) {
  return [];
}

/**
 * 取得進貨總額
 * @param {number} year - 年度
 * @param {number} month - 月份
 * @returns {number} 進貨總額
 */
async function getPurchaseTotal(year, month) {
  // 從資料庫查詢
  return 1250000;
}

/**
 * 取得銷貨總額
 * @param {number} year - 年度
 * @param {number} month - 月份
 * @returns {number} 銷貨總額
 */
async function getSalesTotal(year, month) {
  // 從資料庫查詢
  return 980000;
}

/**
 * 取得總成本
 * @param {number} year - 年度
 * @param {number} month - 月份
 * @returns {number} 總成本
 */
async function getTotalCost(year, month) {
  // 計算進貨成本
  return 710000;
}


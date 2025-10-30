/**
 * 主資料服務
 * 處理產品、廠商、客戶的基礎資料管理
 */

/**
 * 建立產品
 * @param {Object} productData - 產品資料
 * @returns {Object} 建立的產品
 */
export async function createProduct(productData) {
  // 任務 1.1: 建立產品主檔工作表 (10_Products)
  const { code, name, category, unit, costPrice, salesPrice } = productData;
  
  // 檢查產品代碼唯一性
  await validateUniqueCode('Products', code);
  
  const product = {
    Code: code,
    Name: name,
    Category: category,
    Unit: unit,
    CostPrice: costPrice,
    SalesPrice: salesPrice
  };
  
  const productId = await saveProduct(product);
  
  // 為產品建立初始庫存記錄
  await createInitialInventory(productId);
  
  return { ...product, ID: productId };
}

/**
 * 查詢產品
 * @param {Object} filters - 篩選條件
 * @returns {Array} 產品列表
 */
export async function queryProducts(filters = {}) {
  const { keyword, category } = filters;
  
  let products = await getAllProducts();
  
  if (keyword) {
    products = products.filter(p => 
      p.Code.includes(keyword) || p.Name.includes(keyword)
    );
  }
  
  if (category) {
    products = products.filter(p => p.Category === category);
  }
  
  return products;
}

/**
 * 更新產品價格
 * @param {number} productId - 產品 ID
 * @param {Object} priceData - 價格資料
 * @returns {Object} 更新後的產品
 */
export async function updateProductPrice(productId, priceData) {
  const { costPrice, salesPrice } = priceData;
  
  const product = await getProduct(productId);
  
  product.CostPrice = costPrice;
  product.SalesPrice = salesPrice;
  
  await saveProduct(product);
  
  return product;
}

/**
 * 建立廠商
 * @param {Object} supplierData - 廠商資料
 * @returns {Object} 建立的廠商
 */
export async function createSupplier(supplierData) {
  // 任務 1.3: 建立廠商資料工作表 (11_Suppliers)
  const { code, name, taxId, contact, paymentTerms } = supplierData;
  
  // 檢查廠商代碼唯一性
  await validateUniqueCode('Suppliers', code);
  
  const supplier = {
    Code: code,
    Name: name,
    TaxID: taxId,
    Contact: contact,
    PaymentTerms: paymentTerms
  };
  
  const supplierId = await saveSupplier(supplier);
  
  return { ...supplier, ID: supplierId };
}

/**
 * 查詢廠商進貨歷史
 * @param {number} supplierId - 廠商 ID
 * @returns {Array} 進貨紀錄列表
 */
export async function querySupplierPurchaseHistory(supplierId) {
  const purchases = await queryPurchasesBySupplier(supplierId);
  
  return purchases.map(purchase => ({
    PurchaseNo: purchase.PurchaseNo,
    Date: purchase.Date,
    Amount: purchase.Amount,
    Status: purchase.Status
  }));
}

/**
 * 建立客戶
 * @param {Object} customerData - 客戶資料
 * @returns {Object} 建立的客戶
 */
export async function createCustomer(customerData) {
  // 任務 1.5: 建立客戶資料工作表 (12_Customers)
  const { code, name, taxId, contact, creditLimit } = customerData;
  
  // 檢查客戶代碼唯一性
  await validateUniqueCode('Customers', code);
  
  const customer = {
    Code: code,
    Name: name,
    TaxID: taxId,
    Contact: contact,
    CreditLimit: creditLimit
  };
  
  const customerId = await saveCustomer(customer);
  
  return { ...customer, ID: customerId };
}

/**
 * 驗證代碼唯一性
 * @param {string} table - 資料表名稱
 * @param {string} code - 代碼
 * @throws {Error} 如果代碼已存在
 */
// 任務 1.7: 設定主鍵唯一性驗證
async function validateUniqueCode(table, code) {
  const exists = await checkCodeExists(table, code);
  
  if (exists) {
    throw new Error(`${table} 代碼 ${code} 已存在！`);
  }
}

/**
 * 建立初始庫存記錄
 * @param {number} productId - 產品 ID
 */
async function createInitialInventory(productId) {
  const inventory = {
    ProductID: productId,
    BeginningQty: 0,
    PurchaseQty: 0,
    SalesQty: 0,
    CurrentQty: 0
  };
  
  await saveInventory(inventory);
}

// ============================================
// 內部輔助函數
// ============================================

async function saveProduct(product) {
  console.log('儲存產品:', product);
  return 1;
}

async function getAllProducts() {
  return [
    { ID: 1, Code: 'PROD-001', Name: '產品A', Category: '電子產品', Unit: '個', CostPrice: 100, SalesPrice: 150 }
  ];
}

async function getProduct(productId) {
  return { ID: productId, Code: 'PROD-001', Name: '產品A', CostPrice: 100, SalesPrice: 150 };
}

async function saveSupplier(supplier) {
  console.log('儲存廠商:', supplier);
  return 1;
}

async function saveCustomer(customer) {
  console.log('儲存客戶:', customer);
  return 1;
}

async function checkCodeExists(table, code) {
  return false;
}

async function queryPurchasesBySupplier(supplierId) {
  return [];
}

async function saveInventory(inventory) {
  console.log('儲存庫存:', inventory);
}


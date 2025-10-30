# 實作任務清單

## 1. 主資料層建置

- [ ] 1.1 建立產品主檔工作表 (10_Products)
- [ ] 1.2 定義產品欄位：ID, Code, Name, Category, Unit, CostPrice, SalesPrice
- [ ] 1.3 建立廠商資料工作表 (11_Suppliers)
- [ ] 1.4 定義廠商欄位：ID, Code, Name, TaxID, Contact, PaymentTerms
- [ ] 1.5 建立客戶資料工作表 (12_Customers)
- [ ] 1.6 定義客戶欄位：ID, Code, Name, TaxID, Contact, CreditLimit
- [ ] 1.7 設定主鍵唯一性驗證

## 2. 進貨模組建置

- [ ] 2.1 建立進貨主檔工作表 (20_PurchaseMaster)
- [ ] 2.2 定義進貨主檔欄位：ID, PurchaseNo, SupplierID, Date, Amount, Tax, Status
- [ ] 2.3 建立進貨明細工作表 (21_PurchaseDetails)
- [ ] 2.4 定義進貨明細欄位：ID, PurchaseID, ProductID, Quantity, UnitPrice, SubTotal
- [ ] 2.5 建立外鍵關聯：進貨主檔 → 廠商、進貨明細 → 產品
- [ ] 2.6 實作總金額自動計算公式

## 3. 銷貨模組建置

- [ ] 3.1 建立銷貨主檔工作表 (30_SalesMaster)
- [ ] 3.2 定義銷貨主檔欄位：ID, SalesNo, CustomerID, Date, Amount, Tax, InvoiceNo, InvoiceDate, Status
- [ ] 3.3 建立銷貨明細工作表 (31_SalesDetails)
- [ ] 3.4 定義銷貨明細欄位：ID, SalesID, ProductID, Quantity, UnitPrice, SubTotal
- [ ] 3.5 建立外鍵關聯：銷貨主檔 → 客戶、銷貨明細 → 產品
- [ ] 3.6 實作總金額自動計算公式

## 4. 財務模組建置

- [ ] 4.1 建立付款紀錄工作表 (40_Payments)
- [ ] 4.2 定義付款欄位：ID, SalesID, PaymentNo, Date, PaymentMethod, Amount
- [ ] 4.3 建立外鍵關聯：付款 → 銷貨主檔
- [ ] 4.4 實作應收帳款計算邏輯
- [ ] 4.5 實作部分付款支援機制

## 5. 庫存模組建置

- [ ] 5.1 建立即時庫存工作表 (50_Inventory)
- [ ] 5.2 定義庫存欄位：ID, ProductID, BeginningQty, PurchaseQty, SalesQty, CurrentQty
- [ ] 5.3 建立外鍵關聯：庫存 → 產品
- [ ] 5.4 實作進貨自動更新庫存機制（進貨量 +）
- [ ] 5.5 實作銷貨自動更新庫存機制（銷貨量 +）
- [ ] 5.6 實作現存量自動計算公式（期初 + 進貨 - 銷貨）

## 6. 分析模組建置

- [ ] 6.1 建立歷史進貨價格工作表 (60_PriceHistory)
- [ ] 6.2 定義歷史價格欄位：ID, SupplierID, ProductID, PurchaseDate, UnitPrice
- [ ] 6.3 實作進貨時自動記錄歷史價格
- [ ] 6.4 建立比價分析來源工作表 (61_PriceComparison)
- [ ] 6.5 定義比價欄位：ProductID, SupplierID, UnitPrice, Date
- [ ] 6.6 建立部門支出來源工作表 (70_DepartmentExpense)
- [ ] 6.7 定義部門支出欄位：ID, Year, Month, Department, Category, Tax, TotalAmount
- [ ] 6.8 建立儀表板資料工作表 (80_DashboardData)
- [ ] 6.9 定義儀表板欄位：ID, Year, Month, IndicatorType, Amount
- [ ] 6.10 建立樞紐分析表：月度進貨、月度銷貨、毛利分析

## 7. 資料驗證與測試

- [ ] 7.1 測試主鍵唯一性
- [ ] 7.2 測試外鍵參照完整性
- [ ] 7.3 測試進貨單新增後庫存正確增加
- [ ] 7.4 測試銷貨單新增後庫存正確減少
- [ ] 7.5 測試付款金額不超過應收款項
- [ ] 7.6 測試發票號碼唯一性
- [ ] 7.7 測試月份彙總金額與明細加總一致
- [ ] 7.8 測試比價分析資料來源可追溯

## 8. 文件與說明

- [ ] 8.1 建立使用者操作手冊
- [ ] 8.2 建立欄位說明文件
- [ ] 8.3 建立公式說明文件
- [ ] 8.4 建立疑難排解指南
- [ ] 8.5 建立資料備份與還原流程


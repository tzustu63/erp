# 付款紀錄頁面資料流說明

## 📊 資料來源

### 1. 銷貨單下拉選單資料

**來源**: `/api/sales` API
**取得方式**: 
```javascript
async function fetchSales() {
  const response = await fetch('/api/sales');
  const data = await response.json();
  setSales(Array.isArray(data) ? data : []);
}
```

**資料位置**: `lib/mockDataStore.js` → `store.sales[]`

**資料結構**:
```javascript
{
  id: 1,
  salesNo: 'SAL-20241219-0001',
  customerId: 1,
  salesDate: '2024-12-19',
  invoiceNo: 'INV-001',
  invoiceDate: '2024-12-19',
  amount: 1500.00,
  tax: 75.00,
  status: '已出貨',
  items: [...]
}
```

---

### 2. 付款紀錄列表資料

**來源**: `/api/payments` API  
**取得方式**:
```javascript
async function fetchPayments() {
  const response = await fetch('/api/payments');
  const data = await response.json();
  setPayments(Array.isArray(data) ? data : []);
}
```

**資料位置**: `lib/mockDataStore.js` → `store.payments[]`  
**初始狀態**: `[]` (空陣列)

**資料結構**:
```javascript
{
  id: 1,
  salesId: 1,                    // 關聯到銷貨單 ID
  paymentNo: 'PAY-20241219-0001',
  paymentDate: '2024-12-19',
  paymentMethod: '現金',          // 現金/轉帳/支票/信用卡
  amount: 1500.00,
  createdAt: '2024-12-19T...'
}
```

---

### 3. 表單欄位資料來源

| 欄位 | 資料來源 | 說明 |
|------|----------|------|
| **銷貨單號** | `fetchSales()` → `store.sales[]` | 從銷貨單列表中選擇 |
| **付款單號** | 自動產生 | 格式: `PAY-YYYYMMDD-XXXX` |
| **付款日期** | 預設當天 | `new Date().toISOString().split('T')[0]` |
| **付款方式** | 預設值 | `現金`（可選擇：現金/轉帳/支票/信用卡） |
| **金額** | 使用者輸入 | 手動輸入數值 |

---

## 🔄 資料流程

### 載入頁面時

```
使用者開啟付款紀錄頁面
    ↓
useEffect 觸發
    ↓
fetchSales() → /api/sales
    ↓
fetchPayments() → /api/payments
    ↓
顯示表單與列表
```

---

### 新增付款紀錄時

```
使用者在表單中輸入資料
    ↓
點擊「儲存」按鈕
    ↓
handleSubmit() 執行
    ↓
POST /api/payments
    ↓
payload: {
  salesId: 1,
  paymentNo: '',              // 空字串，自動產生
  paymentDate: '2024-12-19',
  paymentMethod: '現金',
  amount: '1500'
}
    ↓
API 產生付款單號
    ↓
存入 store.payments[]
    ↓
返回成功
    ↓
重新 fetchPayments()
    ↓
列表更新顯示新資料
```

---

### 刪除付款紀錄時

```
使用者點擊「刪除」按鈕
    ↓
confirm 確認
    ↓
handleDelete(paymentId)
    ↓
DELETE /api/payments/:id
    ↓
從 store.payments[] 移除
    ↓
返回成功
    ↓
重新 fetchPayments()
    ↓
列表更新（資料消失）
```

---

## 🗂️ 資料存儲位置

### 開發環境（目前）

**檔案**: `lib/mockDataStore.js`

```javascript
global.mockDataStore = {
  sales: [],      // 銷貨單資料
  payments: [],   // 付款紀錄資料
  counters: {
    payment: 1    // 付款單號計數器
  }
}
```

**特性**:
- 使用 Node.js 全域變數 `global`
- 開發伺服器重啟後資料會重置
- 僅用於開發測試

---

### 生產環境（規劃）

**資料庫**: PostgreSQL  
**表格**: `payments`

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  sales_id INTEGER NOT NULL REFERENCES sales_masters(id),
  payment_no VARCHAR(50) UNIQUE NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**ORM**: Prisma

```prisma
model Payment {
  id           Int      @id @default(autoincrement())
  salesId      Int      @map("sales_id")
  paymentNo    String   @unique @map("payment_no")
  paymentDate  DateTime @map("payment_date") @db.Date
  paymentMethod String   @map("payment_method")
  amount       Decimal  @db.Decimal(12, 2)
  createdAt    DateTime @default(now()) @map("created_at")
  
  sales        SalesMaster @relation(fields: [salesId], references: [id])
  
  @@map("payments")
}
```

---

## 🔍 資料關聯

### 付款紀錄與銷貨單

```
付款紀錄 (Payments)
    ↓ (salesId 外鍵)
銷貨單 (Sales Masters)
    ↓ (salesNo 顯示)
銷貨單號文字
```

**顯示邏輯**:
```javascript
function getSalesNo(salesId) {
  const sale = sales.find(s => s.id === salesId);
  return sale ? sale.salesNo : '未知單號';
}
```

---

## 📝 API 端點

### GET /api/payments
**功能**: 取得所有付款紀錄  
**回傳**: `Payment[]`

### POST /api/payments
**功能**: 新增付款紀錄  
**參數**:
```json
{
  "salesId": 1,
  "paymentNo": "",         // 選填，不填則自動產生
  "paymentDate": "2024-12-19",
  "paymentMethod": "現金",
  "amount": 1500.00
}
```

### DELETE /api/payments/:id
**功能**: 刪除付款紀錄  
**參數**: URL 中的 `:id`

---

## ⚠️ 注意事項

1. **資料持久性**: 開發環境資料在伺服器重啟後會消失
2. **單號產生**: 格式為 `PAY-YYYYMMDD-XXXX`（如: `PAY-20241219-0001`）
3. **必填欄位**: 銷貨單號、付款日期、付款方式、金額
4. **關聯資料**: 付款紀錄必須關聯到已存在的銷貨單
5. **金額驗證**: 應為正數值

---

## 🚀 未來改進

1. ✅ 連接真實資料庫
2. ✅ 加入金額驗證
3. ✅ 顯示銷貨單客戶名稱
4. ✅ 累計未付金額統計
5. ✅ 批次付款功能


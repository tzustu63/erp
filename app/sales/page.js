'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SalesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerId: '',
    salesDate: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    status: '待出貨'
  });
  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: '',
    unitPrice: ''
  });

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchSales();
  }, []);

  async function fetchSales() {
    try {
      const response = await fetch('/api/sales');
      const data = await response.json();
      setSales(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('取得銷貨單列表失敗:', error);
      setSales([]);
      setLoading(false);
    }
  }

  function getCustomerName(customerId) {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : '未知客戶';
  }

  function handleViewDetails(sale) {
    let message = `銷貨單詳情：\n\n單號：${sale.salesNo}\n客戶：${getCustomerName(sale.customerId)}\n日期：${sale.salesDate}\n發票號：${sale.invoiceNo || '-'}\n發票日期：${sale.invoiceDate}\n小計：NT$ ${parseFloat(sale.amount).toFixed(2)}\n稅額：NT$ ${parseFloat(sale.tax).toFixed(2)}\n總金額：NT$ ${(parseFloat(sale.amount) + parseFloat(sale.tax)).toFixed(2)}\n狀態：${sale.status}\n\n商品明細：\n`;
    
    sale.items.forEach((item, idx) => {
      const product = products.find(p => p.id === item.productId);
      message += `${idx + 1}. ${product ? product.name : '未知商品'} - 數量：${item.quantity}，單價：NT$ ${item.unitPrice}\n`;
    });
    
    alert(message);
  }

  function handleEdit(sale) {
    setEditingSale(sale);
    setShowAddForm(true);
    setFormData({
      customerId: sale.customerId.toString(),
      salesDate: sale.salesDate,
      invoiceNo: sale.invoiceNo || '',
      invoiceDate: sale.invoiceDate,
      status: sale.status
    });
    
    // 載入現有明細
    const saleItems = sale.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId.toString(),
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        productName: product ? product.name : '未知商品',
        subtotal: item.quantity * item.unitPrice
      };
    });
    setItems(saleItems);
  }

  async function handleDelete(saleId) {
    if (!confirm('確定要刪除這張銷貨單嗎？')) return;
    
    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('銷貨單刪除成功！');
        fetchSales();
      } else {
        const error = await response.json();
        alert('刪除失敗：' + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('刪除銷貨單失敗:', error);
      alert('刪除銷貨單失敗，請稍後再試');
    }
  }

  async function fetchCustomers() {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('取得客戶列表失敗:', error);
      setCustomers([]);
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('取得產品列表失敗:', error);
      setProducts([]);
    }
  }

  function addItem() {
    if (!newItem.productId || !newItem.quantity || !newItem.unitPrice) {
      alert('請填寫完整的商品資訊');
      return;
    }

    const product = products.find(p => p.id === parseInt(newItem.productId));
    if (!product) {
      alert('找不到選定的產品');
      return;
    }

    const quantity = parseFloat(newItem.quantity);
    const unitPrice = parseFloat(newItem.unitPrice);
    const subtotal = quantity * unitPrice;

    setItems([...items, {
      ...newItem,
      productName: product.name,
      subtotal
    }]);

    setNewItem({
      productId: '',
      quantity: '',
      unitPrice: ''
    });
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  function calculateTotal() {
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const tax = subtotal * 0.05;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2)
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (items.length === 0) {
      alert('請至少新增一項商品');
      return;
    }

    try {
      const totals = calculateTotal();
      const salesData = {
        ...formData,
        items: items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice)
        })),
        amount: parseFloat(totals.subtotal),
        tax: parseFloat(totals.tax)
      };

      const isEditing = !!editingSale;
      const url = isEditing ? `/api/sales/${editingSale.id}` : '/api/sales';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salesData)
      });

      if (response.ok) {
        alert(`銷貨單${isEditing ? '更新' : '新增'}成功！`);
        setShowAddForm(false);
        setEditingSale(null);
        setItems([]);
        setFormData({
          customerId: '',
          salesDate: new Date().toISOString().split('T')[0],
          invoiceNo: '',
          invoiceDate: new Date().toISOString().split('T')[0],
          status: '待出貨'
        });
        fetchSales();
      } else {
        const error = await response.json();
        alert(`${isEditing ? '更新' : '新增'}失敗：` + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error(`${editingSale ? '更新' : '新增'}銷貨單失敗:`, error);
      alert(`${editingSale ? '更新' : '新增'}銷貨單失敗，請稍後再試`);
    }
  }

  const totals = items.length > 0 ? calculateTotal() : { subtotal: '0', tax: '0', total: '0' };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 導航欄 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-800">📦 進銷存系統</h1>
            <div className="flex gap-6 text-sm flex-wrap">
              <Link href="/" className="hover:text-blue-600">儀表板</Link>
              <Link href="/products" className="hover:text-blue-600">主資料</Link>
              <Link href="/suppliers" className="hover:text-blue-600">廠商</Link>
              <Link href="/customers" className="hover:text-blue-600">客戶</Link>
              <Link href="/purchasing" className="hover:text-blue-600">進貨</Link>
              <Link href="/sales" className="font-medium text-blue-600">銷貨</Link>
              <Link href="/finance" className="hover:text-blue-600">財務</Link>
              <Link href="/inventory" className="hover:text-blue-600">庫存</Link>
              <Link href="/analytics" className="hover:text-blue-600">分析</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 標題與操作 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">銷貨單管理</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ 新增銷貨單
          </button>
        </div>

        {/* 新增銷貨單表單 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">{editingSale ? '編輯銷貨單' : '新增銷貨單'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    客戶 *
                  </label>
                  <select
                    required
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選擇客戶...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    銷貨日期 *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.salesDate}
                    onChange={(e) => setFormData({ ...formData, salesDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    發票號碼
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNo}
                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    發票日期
                  </label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    狀態
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>待出貨</option>
                    <option>已出貨</option>
                    <option>已取消</option>
                  </select>
                </div>
              </div>

              {/* 銷貨明細 */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">銷貨明細</h4>
                <div className="border rounded-lg p-4 mb-4">
                  {items.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">產品</th>
                          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">數量</th>
                          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">單價</th>
                          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">小計</th>
                          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 text-sm">{item.productName}</td>
                            <td className="px-3 py-2 text-sm">{item.quantity}</td>
                            <td className="px-3 py-2 text-sm">NT$ {item.unitPrice}</td>
                            <td className="px-3 py-2 text-sm">NT$ {item.subtotal.toFixed(2)}</td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                刪除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 text-center py-4">尚未新增商品</p>
                  )}
                </div>

                {/* 新增商品 */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <select
                        value={newItem.productId}
                        onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">選擇產品...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="數量"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="單價"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={addItem}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        新增
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 金額計算 */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-end gap-8">
                  <div>
                    <span className="text-sm text-gray-600">小計：</span>
                    <span className="text-lg font-semibold ml-2">NT$ {totals.subtotal}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">稅額 (5%)：</span>
                    <span className="text-lg font-semibold ml-2">NT$ {totals.tax}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">總金額：</span>
                    <span className="text-xl font-bold text-blue-600 ml-2">NT$ {totals.total}</span>
                  </div>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSale(null);
                    setItems([]);
                    setFormData({
                      customerId: '',
                      salesDate: new Date().toISOString().split('T')[0],
                      invoiceNo: '',
                      invoiceDate: new Date().toISOString().split('T')[0],
                      status: '待出貨'
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 篩選區 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select className="px-3 py-2 border rounded">
              <option>全部客戶</option>
            </select>
            <input type="date" className="px-3 py-2 border rounded" />
            <span>~</span>
            <input type="date" className="px-3 py-2 border rounded" />
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              查詢
            </button>
          </div>
        </div>

        {/* 列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">單號</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">客戶</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">金額</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">發票號</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">狀態</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    載入中...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    尚無銷貨資料
                  </td>
                </tr>
              ) : (
                sales.map((sale, index) => (
                  <tr key={sale.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">{sale.salesNo}</td>
                    <td className="px-4 py-3 text-sm">{getCustomerName(sale.customerId)}</td>
                    <td className="px-4 py-3 text-sm">{sale.salesDate}</td>
                    <td className="px-4 py-3 text-sm">NT$ {parseFloat(sale.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">{sale.invoiceNo || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        sale.status === '已出貨' ? 'bg-green-100 text-green-800' :
                        sale.status === '待出貨' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(sale)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          查看
                        </button>
                        <button
                          onClick={() => handleEdit(sale)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

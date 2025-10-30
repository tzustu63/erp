'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FinancePage() {
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    salesId: '',
    paymentNo: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '現金',
    amount: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchSales();
  }, []);

  async function fetchPayments() {
    try {
      const response = await fetch('/api/payments');
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('取得付款列表失敗:', error);
      setPayments([]);
      setLoading(false);
    }
  }

  async function fetchSales() {
    try {
      const response = await fetch('/api/sales');
      const data = await response.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('取得銷貨單列表失敗:', error);
      setSales([]);
    }
  }

  function getSalesNo(salesId) {
    const sale = sales.find(s => s.id === salesId);
    return sale ? sale.salesNo : '未知單號';
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.salesId || !formData.amount) {
      alert('請填寫完整資訊');
      return;
    }

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('付款紀錄新增成功！');
        setShowAddForm(false);
        setFormData({
          salesId: '',
          paymentNo: '',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: '現金',
          amount: ''
        });
        fetchPayments();
      } else {
        const error = await response.json();
        alert('新增失敗：' + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('新增付款紀錄失敗:', error);
      alert('新增付款紀錄失敗，請稍後再試');
    }
  }

  async function handleDelete(paymentId) {
    if (!confirm('確定要刪除這筆付款紀錄嗎？')) return;
    
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('付款紀錄刪除成功！');
        fetchPayments();
      } else {
        const error = await response.json();
        alert('刪除失敗：' + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('刪除付款紀錄失敗:', error);
      alert('刪除付款紀錄失敗，請稍後再試');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
              <Link href="/sales" className="hover:text-blue-600">銷貨</Link>
              <Link href="/finance" className="font-medium text-blue-600">財務</Link>
              <Link href="/inventory" className="hover:text-blue-600">庫存</Link>
              <Link href="/analytics" className="hover:text-blue-600">分析</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">付款紀錄管理</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ 新增付款
          </button>
        </div>

        {/* 新增付款表單 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">新增付款紀錄</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">銷貨單號 *</label>
                <select
                  required
                  value={formData.salesId}
                  onChange={(e) => setFormData({ ...formData, salesId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選擇銷貨單...</option>
                  {sales.map(s => (
                    <option key={s.id} value={s.id}>{s.salesNo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">付款單號</label>
                <input
                  type="text"
                  value={formData.paymentNo}
                  onChange={(e) => setFormData({ ...formData, paymentNo: e.target.value })}
                  placeholder="自動產生"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">付款日期 *</label>
                <input
                  type="date"
                  required
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">付款方式 *</label>
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>現金</option>
                  <option>轉帳</option>
                  <option>支票</option>
                  <option>信用卡</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">金額 *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      salesId: '',
                      paymentNo: '',
                      paymentDate: new Date().toISOString().split('T')[0],
                      paymentMethod: '現金',
                      amount: ''
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

        {/* 付款列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">單號</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">銷貨單號</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">付款日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">付款方式</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">金額</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">載入中...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">尚無付款紀錄</td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={payment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">{payment.paymentNo}</td>
                    <td className="px-4 py-3 text-sm">{getSalesNo(payment.salesId)}</td>
                    <td className="px-4 py-3 text-sm">{payment.paymentDate}</td>
                    <td className="px-4 py-3 text-sm">{payment.paymentMethod}</td>
                    <td className="px-4 py-3 text-sm">NT$ {parseFloat(payment.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        刪除
                      </button>
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


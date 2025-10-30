'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    taxId: '',
    contact: '',
    paymentTerms: '月結'
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('取得廠商列表失敗:', error);
      setSuppliers([]);
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const isEditing = !!editingSupplier;
      const url = isEditing ? `/api/suppliers/${editingSupplier.id}` : '/api/suppliers';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`廠商${isEditing ? '更新' : '新增'}成功！`);
        setShowAddForm(false);
        setEditingSupplier(null);
        setFormData({ code: '', name: '', taxId: '', contact: '', paymentTerms: '月結' });
        fetchSuppliers();
      } else {
        const error = await response.json();
        alert(`${isEditing ? '更新' : '新增'}失敗：` + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('操作失敗:', error);
      alert('操作失敗，請稍後再試');
    }
  }

  function handleEdit(supplier) {
    setEditingSupplier(supplier);
    setShowAddForm(true);
    setFormData({
      code: supplier.code,
      name: supplier.name,
      taxId: supplier.taxId || '',
      contact: supplier.contact || '',
      paymentTerms: supplier.paymentTerms || '月結'
    });
  }

  async function handleDelete(supplierId) {
    if (!confirm('確定要刪除這個廠商嗎？')) return;
    
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('廠商刪除成功！');
        fetchSuppliers();
      } else {
        const error = await response.json();
        alert('刪除失敗：' + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('刪除廠商失敗:', error);
      alert('刪除廠商失敗，請稍後再試');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">載入中...</p>
      </div>
    );
  }

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
              <Link href="/suppliers" className="font-medium text-blue-600">廠商</Link>
              <Link href="/customers" className="hover:text-blue-600">客戶</Link>
              <Link href="/purchasing" className="hover:text-blue-600">進貨</Link>
              <Link href="/sales" className="hover:text-blue-600">銷貨</Link>
              <Link href="/finance" className="hover:text-blue-600">財務</Link>
              <Link href="/inventory" className="hover:text-blue-600">庫存</Link>
              <Link href="/analytics" className="hover:text-blue-600">分析</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">廠商管理</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ 新增廠商
          </button>
        </div>

        {/* 新增/編輯廠商表單 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">{editingSupplier ? '編輯廠商' : '新增廠商'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  廠商代碼 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  廠商名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  統一編號
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  聯絡人
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  付款條件
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>月結</option>
                  <option>現金</option>
                  <option>支票</option>
                  <option>轉帳</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSupplier(null);
                    setFormData({ code: '', name: '', taxId: '', contact: '', paymentTerms: '月結' });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSupplier ? '更新' : '儲存'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 廠商列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">代碼</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">名稱</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">統一編號</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">聯絡人</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">付款條件</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    尚無廠商資料
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier, index) => (
                  <tr key={supplier.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">{supplier.id}</td>
                    <td className="px-4 py-3 text-sm">{supplier.code}</td>
                    <td className="px-4 py-3 text-sm">{supplier.name}</td>
                    <td className="px-4 py-3 text-sm">{supplier.taxId || '-'}</td>
                    <td className="px-4 py-3 text-sm">{supplier.contact || '-'}</td>
                    <td className="px-4 py-3 text-sm">{supplier.paymentTerms || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
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


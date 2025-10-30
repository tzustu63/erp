'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    unit: '',
    costPrice: '',
    salesPrice: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      const productsList = Array.isArray(data) ? data : [];
      setProducts(productsList);
      setLoading(false);
      return productsList;
    } catch (error) {
      console.error('取得產品列表失敗:', error);
      setProducts([]);
      setLoading(false);
      return [];
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const isEditing = !!editingProduct;
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/products/${editingProduct.id}` : '/api/products';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`產品${isEditing ? '更新' : '新增'}成功！`);
        setShowAddForm(false);
        setEditingProduct(null);
        setFormData({
          code: '',
          name: '',
          category: '',
          unit: '',
          costPrice: '',
          salesPrice: ''
        });
        const productsList = await fetchProducts();
        // 新增產品後跳到最後一頁
        if (!isEditing) {
          const totalItems = productsList.length;
          setCurrentPage(Math.ceil(totalItems / itemsPerPage));
        }
      } else {
        const error = await response.json();
        alert(`${isEditing ? '更新' : '新增'}失敗：` + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('操作失敗:', error);
      alert('操作失敗，請稍後再試');
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setShowAddForm(true);
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category || '',
      unit: product.unit || '',
      costPrice: product.costPrice,
      salesPrice: product.salesPrice
    });
  }

  async function handleDelete(productId) {
    if (!confirm('確定要刪除這個產品嗎？')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('產品刪除成功！');
        fetchProducts();
      } else {
        const error = await response.json();
        alert('刪除失敗：' + (error.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('刪除產品失敗:', error);
      alert('刪除產品失敗，請稍後再試');
    }
  }

  function handleViewDetails(product) {
    alert(`產品詳情：\n\n代碼：${product.code}\n名稱：${product.name}\n類別：${product.category || '未設定'}\n單位：${product.unit || '未設定'}\n成本價：NT$ ${product.costPrice}\n售價：NT$ ${product.salesPrice}`);
  }

  function handleExport() {
    try {
      // 轉換為 CSV 格式
      const headers = ['ID', '產品代碼', '產品名稱', '類別', '單位', '成本價', '售價'];
      const rows = products.map(p => [
        p.id,
        p.code,
        p.name,
        p.category || '',
        p.unit || '',
        p.costPrice,
        p.salesPrice
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // 建立 Blob 並下載
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // 加入 BOM 支援中文
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `產品清單_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      alert('產品資料已匯出！');
    } catch (error) {
      console.error('匯出失敗:', error);
      alert('匯出失敗，請稍後再試');
    }
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const lines = text.split('\n');
        
        if (lines.length < 2) {
          alert('CSV 檔案格式錯誤：至少需要標題列和一筆資料');
          return;
        }

        // 解析 CSV（簡單版本）
        const headers = lines[0].split(',');
        const importedProducts = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          if (values.length >= 7) {
            importedProducts.push({
              code: values[1],
              name: values[2],
              category: values[3] || '',
              unit: values[4] || '',
              costPrice: parseFloat(values[5]) || 0,
              salesPrice: parseFloat(values[6]) || 0
            });
          }
        }

        if (importedProducts.length === 0) {
          alert('沒有有效資料可匯入');
          return;
        }

        // 批次新增產品
        const confirmMsg = `即將匯入 ${importedProducts.length} 筆產品資料，是否繼續？`;
        if (!confirm(confirmMsg)) return;

        let successCount = 0;
        let failCount = 0;

        for (const product of importedProducts) {
          try {
            const response = await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(product)
            });

            if (response.ok) {
              successCount++;
            } else {
              failCount++;
            }
          } catch (error) {
            console.error('匯入產品失敗:', product, error);
            failCount++;
          }
        }

        alert(`匯入完成！\n成功：${successCount} 筆\n失敗：${failCount} 筆`);
        fetchProducts();
      } catch (error) {
        console.error('讀取檔案失敗:', error);
        alert('讀取檔案失敗，請確認檔案格式正確');
      }
    };
    input.click();
  }

  // 計算分頁
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // 生成頁碼陣列
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // 如果總頁數 <= 5，顯示所有頁碼
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 否則只顯示當前頁前後 2 頁
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

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
              <Link href="/products" className="font-medium text-blue-600">主資料</Link>
              <Link href="/suppliers" className="hover:text-blue-600">廠商</Link>
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
          <h2 className="text-2xl font-bold">產品主檔管理</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ 新增產品
          </button>
        </div>

        {/* 新增/編輯產品表單 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">{editingProduct ? '編輯產品' : '新增產品'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  產品代碼 *
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
                  產品名稱 *
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
                  類別
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  單位
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  成本價 *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  售價 *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.salesPrice}
                  onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setFormData({
                      code: '',
                      name: '',
                      category: '',
                      unit: '',
                      costPrice: '',
                      salesPrice: ''
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
                  {editingProduct ? '更新' : '儲存'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 搜尋區 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="搜尋產品..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              搜尋
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-blue-600 hover:underline"
            >
              匯出
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 text-blue-600 hover:underline"
            >
              匯入
            </button>
          </div>
        </div>

        {/* 產品列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">代碼</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">名稱</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">類別</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">單位</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">成本價</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">售價</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    {products.length === 0 ? '尚無產品資料' : '此頁無資料'}
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">{product.id}</td>
                    <td className="px-4 py-3 text-sm">{product.code}</td>
                    <td className="px-4 py-3 text-sm">{product.name}</td>
                    <td className="px-4 py-3 text-sm">{product.category}</td>
                    <td className="px-4 py-3 text-sm">{product.unit}</td>
                    <td className="px-4 py-3 text-sm">NT$ {product.costPrice}</td>
                    <td className="px-4 py-3 text-sm">NT$ {product.salesPrice}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          刪除
                        </button>
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          詳情
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁器 */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt; Prev
            </button>
            
            {totalPages > 5 && currentPage > 3 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  1
                </button>
                <span className="px-2 text-gray-500">...</span>
              </>
            )}
            
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-lg ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next &gt;
            </button>
            
            <span className="ml-4 text-sm text-gray-600">每頁顯示</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border rounded"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">筆</span>
            <span className="ml-2 text-sm text-gray-600">
              (共 {products.length} 筆，第 {currentPage} / {totalPages} 頁)
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

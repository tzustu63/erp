'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      thisMonthPurchase: 0,
      thisMonthSales: 0,
      grossProfit: 0,
      grossProfitMargin: 0,
      lowInventoryCount: 0
    },
    recentTransactions: [],
    thisMonthTrend: { purchases: 0, sales: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('取得儀表板資料失敗:', error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-800">📦 進銷存系統</h1>
            <div className="flex gap-6 text-sm flex-wrap">
              <Link href="/" className="font-medium text-blue-600">儀表板</Link>
              <Link href="/products" className="hover:text-blue-600">主資料</Link>
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
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">本月進貨</p>
            <p className="text-3xl font-bold text-gray-900">
              NT$ {loading ? '-' : dashboardData.kpis.thisMonthPurchase.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">本月 {dashboardData.thisMonthTrend.purchases} 筆</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">本月銷貨</p>
            <p className="text-3xl font-bold text-gray-900">
              NT$ {loading ? '-' : dashboardData.kpis.thisMonthSales.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">本月 {dashboardData.thisMonthTrend.sales} 筆</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-2">本月毛利</p>
            <p className="text-3xl font-bold text-gray-900">
              NT$ {loading ? '-' : dashboardData.kpis.grossProfit.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">毛利率 {dashboardData.kpis.grossProfitMargin}%</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-2">庫存警示</p>
            <p className="text-3xl font-bold text-red-600">
              {loading ? '-' : dashboardData.kpis.lowInventoryCount} 項
            </p>
            <a href="/inventory" className="text-sm text-blue-600 mt-2 inline-block">
              查看詳情 →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📈 進銷貨趨勢</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">進貨：{dashboardData.thisMonthTrend.purchases} 筆</p>
                <p className="text-gray-500">銷貨：{dashboardData.thisMonthTrend.sales} 筆</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📊 部門支出</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">請至分析頁面查看詳細資料</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <Link href="/purchasing" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
            <span>➕</span>
            <span>新增進貨單</span>
          </Link>
          <Link href="/sales" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
            <span>➕</span>
            <span>新增銷貨單</span>
          </Link>
          <Link href="/inventory" className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 inline-flex items-center gap-2">
            <span>📦</span>
            <span>查詢庫存</span>
          </Link>
          <Link href="/analytics" className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 inline-flex items-center gap-2">
            <span>📊</span>
            <span>查看報表</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">最近交易</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">時間</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">類型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">單號</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">金額</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">載入中...</td>
                  </tr>
                ) : dashboardData.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">尚無交易資料</td>
                  </tr>
                ) : (
                  dashboardData.recentTransactions.map((t, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{t.date}</td>
                      <td className="px-4 py-3">
                        <span className={t.type === '進貨' ? 'text-blue-600' : 'text-green-600'}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{t.no}</td>
                      <td className="px-4 py-3">NT$ {parseFloat(t.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={t.status === '已完成' || t.status === '已出貨' ? 'text-green-600' : 'text-yellow-600'}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

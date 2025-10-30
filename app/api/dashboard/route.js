import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function GET(request) {
  try {
    const store = getStore();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // 計算本月進貨總額
    const thisMonthPurchases = store.purchases.filter(p => {
      const purchaseDate = new Date(p.purchaseDate);
      return purchaseDate.getFullYear() === currentYear && purchaseDate.getMonth() + 1 === currentMonth;
    });
    const purchaseTotal = thisMonthPurchases.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    
    // 計算本月銷貨總額
    const thisMonthSales = store.sales.filter(s => {
      const salesDate = new Date(s.salesDate);
      return salesDate.getFullYear() === currentYear && salesDate.getMonth() + 1 === currentMonth;
    });
    const salesTotal = thisMonthSales.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
    
    // 計算毛利（銷貨 - 進貨成本）
    const salesCost = thisMonthSales.reduce((sum, s) => {
      const itemCost = (s.items || []).reduce((itemSum, item) => {
        const product = store.products.find(p => p.id === item.productId);
        return itemSum + (parseFloat(item.quantity) * (product ? parseFloat(product.costPrice) : 0));
      }, 0);
      return sum + itemCost;
    }, 0);
    const grossProfit = salesTotal - salesCost;
    
    // 計算毛利潤率
    const grossProfitMargin = salesTotal > 0 ? ((grossProfit / salesTotal) * 100).toFixed(2) : 0;
    
    // 計算庫存警示（庫存 < 10）
    const lowInventoryCount = store.products.length; // 簡化計算
    
    // 計算最近交易
    const recentTransactions = [
      ...store.sales.slice(-5).map(s => ({
        type: '銷貨',
        no: s.salesNo,
        date: s.salesDate,
        amount: parseFloat(s.amount || 0),
        status: s.status
      })),
      ...store.purchases.slice(-5).map(p => ({
        type: '進貨',
        no: p.purchaseNo,
        date: p.purchaseDate,
        amount: parseFloat(p.amount || 0),
        status: p.status
      }))
    ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
    
    const dashboardData = {
      kpis: {
        thisMonthPurchase: purchaseTotal,
        thisMonthSales: salesTotal,
        grossProfit: grossProfit,
        grossProfitMargin: grossProfitMargin,
        lowInventoryCount: lowInventoryCount
      },
      recentTransactions,
      thisMonthTrend: {
        purchases: thisMonthPurchases.length,
        sales: thisMonthSales.length
      }
    };
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('取得儀表板資料錯誤:', error);
    return NextResponse.json({
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
  }
}


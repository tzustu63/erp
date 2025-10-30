import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function GET(request) {
  try {
    const store = getStore();
    return NextResponse.json(store.sales);
  } catch (error) {
    console.error('查詢銷貨單錯誤:', error);
    const store = getStore();
    return NextResponse.json(store.sales);
  }
}

export async function POST(request) {
  try {
    const store = getStore();
    const data = await request.json();

    if (!data.customerId || !data.items || data.items.length === 0) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const salesNo = `SAL-${today}-${String(store.counters.sales).padStart(4, '0')}`;

    const newSale = {
      id: store.counters.sales++,
      salesNo,
      customerId: parseInt(data.customerId),
      salesDate: data.salesDate,
      invoiceNo: data.invoiceNo || '',
      invoiceDate: data.invoiceDate || data.salesDate,
      amount: data.amount || 0,
      tax: data.tax || 0,
      status: data.status || '待出貨',
      items: data.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.sales.push(newSale);
    return NextResponse.json(newSale, { status: 201 });
  } catch (error) {
    console.error('建立銷貨單錯誤:', error);
    return NextResponse.json({ error: '建立銷貨單失敗' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function PUT(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const data = await request.json();
    const salesIndex = store.sales.findIndex(s => s.id === id);
    
    if (salesIndex === -1) {
      return NextResponse.json({ error: '銷貨單不存在' }, { status: 404 });
    }

    const existingSale = store.sales[salesIndex];
    
    // 更新銷貨單
    store.sales[salesIndex] = {
      ...existingSale,
      customerId: parseInt(data.customerId),
      salesDate: data.salesDate,
      invoiceNo: data.invoiceNo || '',
      invoiceDate: data.invoiceDate,
      status: data.status,
      amount: parseFloat(data.amount),
      tax: parseFloat(data.tax),
      items: data.items,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(store.sales[salesIndex]);
  } catch (error) {
    console.error('更新銷貨單錯誤:', error);
    return NextResponse.json({ error: '更新銷貨單失敗' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const salesIndex = store.sales.findIndex(s => s.id === id);
    
    if (salesIndex === -1) {
      return NextResponse.json({ error: '銷貨單不存在' }, { status: 404 });
    }

    store.sales.splice(salesIndex, 1);
    return NextResponse.json({ message: '銷貨單已刪除' });
  } catch (error) {
    console.error('刪除銷貨單錯誤:', error);
    return NextResponse.json({ error: '刪除銷貨單失敗' }, { status: 500 });
  }
}


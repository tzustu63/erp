import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function PUT(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const data = await request.json();
    const purchaseIndex = store.purchases.findIndex(p => p.id === id);
    
    if (purchaseIndex === -1) {
      return NextResponse.json({ error: '進貨單不存在' }, { status: 404 });
    }

    const existingPurchase = store.purchases[purchaseIndex];
    
    // 更新進貨單
    store.purchases[purchaseIndex] = {
      ...existingPurchase,
      supplierId: parseInt(data.supplierId),
      purchaseDate: data.purchaseDate,
      status: data.status,
      amount: parseFloat(data.amount),
      tax: parseFloat(data.tax),
      items: data.items,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(store.purchases[purchaseIndex]);
  } catch (error) {
    console.error('更新進貨單錯誤:', error);
    return NextResponse.json({ error: '更新進貨單失敗' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const purchaseIndex = store.purchases.findIndex(p => p.id === id);
    
    if (purchaseIndex === -1) {
      return NextResponse.json({ error: '進貨單不存在' }, { status: 404 });
    }

    store.purchases.splice(purchaseIndex, 1);
    return NextResponse.json({ message: '進貨單已刪除' });
  } catch (error) {
    console.error('刪除進貨單錯誤:', error);
    return NextResponse.json({ error: '刪除進貨單失敗' }, { status: 500 });
  }
}


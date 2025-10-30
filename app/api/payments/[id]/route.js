import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function DELETE(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const paymentIndex = store.payments.findIndex(p => p.id === id);
    
    if (paymentIndex === -1) {
      return NextResponse.json({ error: '付款紀錄不存在' }, { status: 404 });
    }

    store.payments.splice(paymentIndex, 1);
    return NextResponse.json({ message: '付款紀錄已刪除' });
  } catch (error) {
    console.error('刪除付款紀錄錯誤:', error);
    return NextResponse.json({ error: '刪除付款紀錄失敗' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function GET(request) {
  try {
    const store = getStore();
    return NextResponse.json(store.payments);
  } catch (error) {
    console.error('查詢付款紀錄錯誤:', error);
    const store = getStore();
    return NextResponse.json(store.payments);
  }
}

export async function POST(request) {
  try {
    const store = getStore();
    const data = await request.json();

    if (!data.salesId || !data.amount) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const paymentNo = data.paymentNo || `PAY-${today}-${String(store.counters.payment).padStart(4, '0')}`;

    const newPayment = {
      id: store.counters.payment++,
      salesId: parseInt(data.salesId),
      paymentNo,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod || '現金',
      amount: parseFloat(data.amount),
      createdAt: new Date().toISOString()
    };

    store.payments.push(newPayment);
    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('建立付款紀錄錯誤:', error);
    return NextResponse.json({ error: '建立付款紀錄失敗' }, { status: 500 });
  }
}


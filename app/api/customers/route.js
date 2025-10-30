import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function GET(request) {
  try {
    const store = getStore();
    return NextResponse.json(store.customers);
  } catch (error) {
    console.error('查詢客戶錯誤:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const store = getStore();
    const data = await request.json();

    if (!data.code || !data.name) {
      return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 });
    }

    const existing = store.customers.find(c => c.code === data.code);
    if (existing) {
      return NextResponse.json({ error: '客戶代碼已存在' }, { status: 409 });
    }

    const newCustomer = { id: store.counters.customer++, ...data };
    store.customers.push(newCustomer);
    
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('建立客戶錯誤:', error);
    return NextResponse.json({ error: '建立客戶失敗' }, { status: 500 });
  }
}

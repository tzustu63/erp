/**
 * 廠商 API 路由
 */

import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function GET(request) {
  try {
    const store = getStore();
    return NextResponse.json(store.suppliers);
  } catch (error) {
    console.error('查詢廠商錯誤:', error);
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

    const existing = store.suppliers.find(s => s.code === data.code);
    if (existing) {
      return NextResponse.json({ error: '廠商代碼已存在' }, { status: 409 });
    }

    const newSupplier = { id: store.counters.supplier++, ...data };
    store.suppliers.push(newSupplier);
    
    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error('建立廠商錯誤:', error);
    return NextResponse.json({ error: '建立廠商失敗' }, { status: 500 });
  }
}

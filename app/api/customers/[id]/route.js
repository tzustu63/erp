import { NextResponse } from 'next/server';
import { getStore } from '@/lib/mockDataStore';

export async function GET(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const customer = store.customers.find(c => c.id === id);
    
    if (!customer) {
      return NextResponse.json({ error: '客戶不存在' }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: '查詢客戶失敗' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const data = await request.json();
    const customerIndex = store.customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return NextResponse.json({ error: '客戶不存在' }, { status: 404 });
    }

    store.customers[customerIndex] = { ...store.customers[customerIndex], ...data };
    return NextResponse.json(store.customers[customerIndex]);
  } catch (error) {
    return NextResponse.json({ error: '更新客戶失敗' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const store = getStore();
    const id = parseInt(params.id);
    const customerIndex = store.customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      return NextResponse.json({ error: '客戶不存在' }, { status: 404 });
    }

    store.customers.splice(customerIndex, 1);
    return NextResponse.json({ message: '客戶已刪除' });
  } catch (error) {
    return NextResponse.json({ error: '刪除客戶失敗' }, { status: 500 });
  }
}


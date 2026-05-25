import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fee from '@/models/Fee';
import Expense from '@/models/Expense';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '100', 10) || 100));

    const [fees, expenses] = await Promise.all([
      Fee.find().sort({ createdAt: -1 }).limit(limit).lean(),
      Expense.find().sort({ date: -1 }).limit(limit).lean(),
    ]);

    const transactions = [
      ...fees.map((f) => ({
        _id: f._id,
        ref: 'FEE-' + String(f._id).substring(0, 4).toUpperCase(),
        title: 'Fee Collection',
        date: (f as { paymentDate?: Date; createdAt?: Date }).paymentDate || f.createdAt,
        amount: (f as { amountPaid?: number; amount: number }).amountPaid || f.amount,
        type: 'Income',
      })),
      ...expenses.map((e) => ({
        _id: e._id,
        ref: 'EXP-' + String(e._id).substring(0, 4).toUpperCase(),
        title: e.title,
        date: e.date,
        amount: e.amount,
        type: 'Expense',
        category: e.category,
      })),
    ];

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(transactions.slice(0, limit));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

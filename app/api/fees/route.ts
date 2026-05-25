import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fee from '@/models/Fee';
import { buildPaginationMeta, parsePagination } from '@/lib/pagination';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, 25, 100);

    if (pagination) {
      const [fees, total] = await Promise.all([
        Fee.find().sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
        Fee.countDocuments(),
      ]);
      return NextResponse.json({
        data: fees,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      });
    }

    const fees = await Fee.find().sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json(fees, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch fees';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    data.transactionId = `TXN-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

    const fee = new Fee(data);
    await fee.save();

    return NextResponse.json(fee, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create fee';
    return NextResponse.json({ message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import { buildPaginationMeta, parsePagination } from '@/lib/pagination';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, 25, 100);

    if (pagination) {
      const [staff, total] = await Promise.all([
        Staff.find().sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
        Staff.countDocuments(),
      ]);
      return NextResponse.json({
        data: staff,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      });
    }

    const staff = await Staff.find().sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json(staff, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch staff';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    data.empId = `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const staff = new Staff(data);
    await staff.save();

    return NextResponse.json(staff, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create staff';
    return NextResponse.json({ message }, { status: 500 });
  }
}

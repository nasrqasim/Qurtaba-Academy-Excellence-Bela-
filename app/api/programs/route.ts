import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Program from '@/models/Program';
import { buildPaginationMeta, parsePagination } from '@/lib/pagination';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, 20, 100);

    if (pagination) {
      const [programs, total] = await Promise.all([
        Program.find().sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
        Program.countDocuments(),
      ]);
      return NextResponse.json({
        data: programs,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      });
    }

    const programs = await Program.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(programs, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch programs';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const program = await Program.create(data);
    return NextResponse.json({ message: 'Program created successfully', program }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create program';
    return NextResponse.json({ message }, { status: 500 });
  }
}

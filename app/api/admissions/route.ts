import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admission from '@/models/Admission';
import { normalizeAdmissionBody } from '@/lib/admission';
import { formatDbConnectionError } from '@/lib/db-error';
import { buildPaginationMeta, parsePagination } from '@/lib/pagination';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { data, error } = normalizeAdmissionBody(body);

    if (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }

    const admission = await Admission.create({
      ...data,
      status: 'Pending',
      appliedDate: new Date(),
    });

    return NextResponse.json(
      { message: 'Application submitted successfully', admission },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = formatDbConnectionError(error);
    const status = message.includes('MongoDB Atlas') ? 503 : 500;
    const detail = error instanceof Error && !message.includes('MongoDB') ? error.message : message;
    return NextResponse.json({ message: detail }, { status });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query: Record<string, string> = {};
    if (status && status !== 'All') query.status = status;

    const pagination = parsePagination(searchParams, 25, 100);

    if (pagination) {
      const [admissions, total] = await Promise.all([
        Admission.find(query)
          .sort({ createdAt: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .lean(),
        Admission.countDocuments(query),
      ]);
      return NextResponse.json({
        data: admissions,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      });
    }

    const admissions = await Admission.find(query).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json(admissions, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admissions';
    return NextResponse.json({ message }, { status: 500 });
  }
}

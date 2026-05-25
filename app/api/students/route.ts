import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Student from '@/models/Student';
import { buildPaginationMeta, parsePagination } from '@/lib/pagination';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query: Record<string, unknown> = {};

    const search = searchParams.get('search');
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const studentClass = searchParams.get('class');
    if (studentClass) {
      query.class = studentClass;
    }

    const section = searchParams.get('section');
    if (section) {
      query.section = section;
    }

    const status = searchParams.get('status');
    if (status) {
      query.status = status;
    }

    const pagination = parsePagination(searchParams, 25, 100);

    if (pagination) {
      const [students, total] = await Promise.all([
        Student.find(query)
          .sort({ createdAt: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .lean(),
        Student.countDocuments(query),
      ]);

      return NextResponse.json({
        data: students,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      });
    }

    const students = await Student.find(query).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json(students, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch students';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const student = await Student.create(data);
    return NextResponse.json({ message: 'Student created successfully', student }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create student';
    return NextResponse.json({ message }, { status: 500 });
  }
}

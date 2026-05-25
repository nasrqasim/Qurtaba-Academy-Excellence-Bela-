import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class');

    const filter: any = {};
    if (className) filter.class = className;

    const assignments = await Assignment.find(filter)
      .populate('teacherId', 'fullName')
      .sort({ createdAt: -1 });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id || (decoded.role !== 'Teacher' && decoded.role !== 'Super Admin' && decoded.role !== 'Admin')) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.title || !body.class || !body.subject || !body.dueDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const assignment = new Assignment({
      title: body.title,
      class: body.class,
      subject: body.subject,
      dueDate: body.dueDate,
      description: body.description || '',
      fileUrl: body.fileUrl || '',
      teacherId: decoded.id
    });

    await assignment.save();
    return NextResponse.json({ message: 'Assignment created successfully', assignment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

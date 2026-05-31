import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const assignment = await Assignment.findById(id).lean();
    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
    }
    return NextResponse.json(assignment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
    }

    if (body.title !== undefined) assignment.title = body.title;
    if (body.class !== undefined) assignment.class = body.class;
    if (body.subject !== undefined) assignment.subject = body.subject;
    if (body.dueDate !== undefined) assignment.dueDate = body.dueDate;
    if (body.description !== undefined) assignment.description = body.description;
    if (body.fileUrl !== undefined) assignment.fileUrl = body.fileUrl;

    await assignment.save();
    return NextResponse.json({ message: 'Assignment updated successfully', assignment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Assignment deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

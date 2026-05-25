import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fee from '@/models/Fee';
import Student from '@/models/Student';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id || decoded.role !== 'Student') {
      return NextResponse.json({ message: 'Invalid session or unauthorized' }, { status: 401 });
    }

    const student = await Student.findById(decoded.id);
    if (!student) {
      return NextResponse.json({ message: 'Student profile not found' }, { status: 404 });
    }

    // Query fees by matching studentName (exact match or case-insensitive)
    const fees = await Fee.find({
      studentName: { $regex: new RegExp('^' + student.fullName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') }
    }).sort({ createdAt: -1 });

    return NextResponse.json(fees, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

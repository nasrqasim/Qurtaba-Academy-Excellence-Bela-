import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/models/Result';
import Exam from '@/models/Exam'; // Ensure Exam model is imported for populate
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

    // Explicitly make sure Exam model is registered
    const exams = Exam;

    const results = await Result.find({ studentId: decoded.id })
      .populate('examId', 'name term year date totalMarks')
      .sort({ createdAt: -1 });

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

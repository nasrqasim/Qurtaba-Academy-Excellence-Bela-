import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/models/Result';

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const examId = url.searchParams.get('examId');
    const studentId = url.searchParams.get('studentId');
    
    let filter: any = {};
    if (examId) filter.examId = examId;
    if (studentId) filter.studentId = studentId;

    const results = await Result.find(filter)
      .populate('studentId', 'fullName admissionNumber class section fatherName')
      .populate('examId')
      .sort({ createdAt: 1 });
      
    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (Array.isArray(body)) {
      const operations = body.map(record => {
        return Result.findOneAndUpdate(
          { studentId: record.studentId, examId: record.examId },
          record,
          { upsert: true, new: true }
        );
      });
      const results = await Promise.all(operations);
      return NextResponse.json({ message: 'Results saved successfully', count: results.length }, { status: 201 });
    } else {
      const result = await Result.findOneAndUpdate(
        { studentId: body.studentId, examId: body.examId },
        body,
        { upsert: true, new: true }
      );
      return NextResponse.json({ message: 'Result saved successfully', result }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exam from '@/models/Exam';

export async function GET() {
  try {
    await connectDB();
    const exams = await Exam.find().sort({ date: 1 });
    return NextResponse.json(exams, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const newExam = await Exam.create(data);
    return NextResponse.json({ message: 'Exam scheduled successfully', exam: newExam }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

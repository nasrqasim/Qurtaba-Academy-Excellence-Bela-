import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exam from '@/models/Exam';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const exam = await Exam.findById(id);
    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }
    return NextResponse.json(exam, { status: 200 });
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
    const { id } = await params;
    const data = await request.json();
    const exam = await Exam.findByIdAndUpdate(id, data, { new: true });
    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Exam updated successfully', exam }, { status: 200 });
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
    const { id } = await params;
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Exam deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

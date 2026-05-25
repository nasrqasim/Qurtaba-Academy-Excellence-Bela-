import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/models/Result';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const result = await Result.findById(id).populate('studentId').populate('examId');
    if (!result) {
      return NextResponse.json({ message: 'Result not found' }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
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
    const result = await Result.findByIdAndUpdate(id, data, { new: true });
    if (!result) {
      return NextResponse.json({ message: 'Result not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Result updated successfully', result }, { status: 200 });
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
    const result = await Result.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ message: 'Result not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Result deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

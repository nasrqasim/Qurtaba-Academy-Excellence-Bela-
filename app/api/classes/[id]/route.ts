import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Class from '@/models/Class';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const classDoc = await Class.findById(id);
    if (!classDoc) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json(classDoc, { status: 200 });
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
    const classDoc = await Class.findByIdAndUpdate(id, data, { new: true });
    if (!classDoc) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Class updated successfully', class: classDoc }, { status: 200 });
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
    const classDoc = await Class.findByIdAndDelete(id);
    if (!classDoc) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

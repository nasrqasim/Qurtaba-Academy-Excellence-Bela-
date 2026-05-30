import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const activity = await Activity.findById(id);
    if (!activity) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json(activity, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    const activity = await Activity.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!activity) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Activity updated successfully', activity }, { status: 200 });
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
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Activity deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

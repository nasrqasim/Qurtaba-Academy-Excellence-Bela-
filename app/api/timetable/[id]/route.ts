import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Timetable from '@/models/Timetable';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const routine = await Timetable.findById(id);
    if (!routine) {
      return NextResponse.json({ message: 'Timetable entry not found' }, { status: 404 });
    }
    return NextResponse.json(routine, { status: 200 });
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
    const routine = await Timetable.findByIdAndUpdate(id, data, { new: true });
    if (!routine) {
      return NextResponse.json({ message: 'Timetable entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Timetable entry updated successfully', routine }, { status: 200 });
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
    const routine = await Timetable.findByIdAndDelete(id);
    if (!routine) {
      return NextResponse.json({ message: 'Timetable entry not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Timetable entry deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

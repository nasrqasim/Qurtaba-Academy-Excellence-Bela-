import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Timetable from '@/models/Timetable';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class');
    const teacher = searchParams.get('teacher');

    const filter: any = {};
    if (className) filter.class = className;
    if (teacher) filter.teacher = teacher;

    const routines = await Timetable.find(filter).sort({ startTime: 1 });
    return NextResponse.json(routines, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Create new entry
    const newRoutine = await Timetable.create(data);
    return NextResponse.json({ message: 'Timetable entry saved successfully', routine: newRoutine }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

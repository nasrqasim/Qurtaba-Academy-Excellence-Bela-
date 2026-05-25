import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Class from '@/models/Class';

export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find();
    
    // Sort classes numerically by name (e.g. 1, 2, ..., 9, 10)
    classes.sort((a, b) => {
      const numA = parseInt(a.name, 10);
      const numB = parseInt(b.name, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        if (numA !== numB) return numA - numB;
        // If names are equal, sort by section
        return (a.section || '').localeCompare(b.section || '');
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(classes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const newClass = await Class.create(data);
    return NextResponse.json({ message: 'Class created', class: newClass }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

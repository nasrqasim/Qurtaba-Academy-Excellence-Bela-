import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Subject from '@/models/Subject';

export async function GET() {
  try {
    await connectDB();
    const subjects = await Subject.find().sort({ createdAt: -1 });
    return NextResponse.json(subjects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Check if subject code already exists to avoid duplicate key error
    const existing = await Subject.findOne({ code: data.code });
    if (existing) {
      return NextResponse.json({ message: `Subject code '${data.code}' already exists` }, { status: 400 });
    }

    const subject = await Subject.create(data);
    return NextResponse.json({ message: 'Subject created successfully', subject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

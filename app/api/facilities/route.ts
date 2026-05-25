import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Facility from '@/models/Facility';

export async function GET() {
  try {
    await connectDB();
    const facilities = await Facility.find().sort({ createdAt: -1 });
    return NextResponse.json(facilities, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const facility = await Facility.create(data);
    return NextResponse.json({ message: 'Facility added', facility }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

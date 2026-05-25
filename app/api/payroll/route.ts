import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payroll from '@/models/Payroll';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI as string);
}

export async function GET() {
  try {
    await connectDB();
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    return NextResponse.json(payrolls);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Check if payroll already exists for the employee and month
    const existing = await Payroll.findOne({ employeeId: body.employeeId, month: body.month });
    if (existing) {
      return NextResponse.json({ message: 'Payroll already generated for this employee and month' }, { status: 400 });
    }

    const payroll = await Payroll.create(body);
    return NextResponse.json(payroll, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

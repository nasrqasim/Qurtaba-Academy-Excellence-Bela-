import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payroll from '@/models/Payroll';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI as string);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return NextResponse.json({ message: 'Payroll record not found' }, { status: 404 });
    }
    return NextResponse.json(payroll);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const payroll = await Payroll.findByIdAndUpdate(id, body, { new: true });
    if (!payroll) {
      return NextResponse.json({ message: 'Payroll record not found' }, { status: 404 });
    }
    return NextResponse.json(payroll);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const payroll = await Payroll.findByIdAndDelete(id);
    if (!payroll) {
      return NextResponse.json({ message: 'Payroll record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Payroll record deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

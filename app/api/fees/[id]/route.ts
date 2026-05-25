import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Fee from '@/models/Fee';

export async function GET(request: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    const fee = await Fee.findById(id);
    if (!fee) {
      return NextResponse.json({ message: 'Fee record not found' }, { status: 404 });
    }
    return NextResponse.json(fee, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    const data = await request.json();
    const fee = await Fee.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!fee) {
      return NextResponse.json({ message: 'Fee record not found' }, { status: 404 });
    }
    return NextResponse.json(fee, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    const fee = await Fee.findByIdAndDelete(id);
    if (!fee) {
      return NextResponse.json({ message: 'Fee record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Fee record deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

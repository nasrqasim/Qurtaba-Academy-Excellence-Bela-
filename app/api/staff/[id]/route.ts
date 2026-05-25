import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';

export async function GET(request: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    const staff = await Staff.findById(id);
    if (!staff) {
      return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
    }
    return NextResponse.json(staff, { status: 200 });
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
    const staff = await Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!staff) {
      return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
    }
    return NextResponse.json(staff, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;
    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) {
      return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Staff deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

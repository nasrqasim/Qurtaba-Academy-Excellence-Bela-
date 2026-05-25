import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';

export async function GET() {
  try {
    await connectDB();
    const teachers = await Staff.find({ department: 'Academic' }, 'fullName empId department designation username loginEnabled').sort({ createdAt: -1 });
    
    const formatted = teachers.map(t => ({
      _id: t._id,
      fullName: t.fullName,
      empId: t.empId,
      department: t.department,
      designation: t.designation,
      username: t.username || '',
      loginEnabled: t.loginEnabled || false
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

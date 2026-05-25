import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';

export async function GET() {
  try {
    await connectDB();
    const staff = await Staff.find({ department: { $ne: 'Academic' } }, 'fullName empId department designation username loginEnabled').sort({ createdAt: -1 });
    
    const formatted = staff.map(s => ({
      _id: s._id,
      fullName: s.fullName,
      empId: s.empId,
      department: s.department,
      designation: s.designation,
      username: s.username || '',
      loginEnabled: s.loginEnabled || false
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

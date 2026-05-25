import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Student from '@/models/Student';

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find({}, 'fullName admissionNumber class username loginEnabled').sort({ createdAt: -1 });
    
    // Format response to include username and login status
    const formatted = students.map(s => ({
      _id: s._id,
      fullName: s.fullName,
      admissionNumber: s.admissionNumber || s._id.toString().substring(18).toUpperCase(),
      class: s.class,
      username: s.username || '',
      loginEnabled: s.loginEnabled || false
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

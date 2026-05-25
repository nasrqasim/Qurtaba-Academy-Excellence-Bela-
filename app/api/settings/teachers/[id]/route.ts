import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import Student from '@/models/Student';
import User from '@/models/User';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { username, password, loginEnabled } = await request.json();

    const teacher = await Staff.findById(id);
    if (!teacher) {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
    }

    if (username) {
      const existsInStaff = await Staff.findOne({ username, _id: { $ne: id } });
      const existsInStudent = await Student.findOne({ username });
      const existsInUser = await User.findOne({ username });

      if (existsInStaff || existsInStudent || existsInUser) {
        return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
      }
      teacher.username = username;
    }

    if (password) {
      teacher.password = password; // Pre-save hook hashes this
    }

    if (loginEnabled !== undefined) {
      teacher.loginEnabled = loginEnabled;
    }

    await teacher.save();
    return NextResponse.json({ 
      message: 'Teacher login updated successfully', 
      teacher: { 
        _id: teacher._id, 
        username: teacher.username, 
        loginEnabled: teacher.loginEnabled 
      } 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

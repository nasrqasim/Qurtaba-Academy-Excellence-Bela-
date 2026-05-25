import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Student from '@/models/Student';
import Staff from '@/models/Staff';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { username, password, loginEnabled } = await request.json();

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    if (username) {
      const existsInStudent = await Student.findOne({ username, _id: { $ne: id } });
      const existsInUser = await User.findOne({ username });
      const existsInStaff = await Staff.findOne({ username });

      if (existsInStudent || existsInUser || existsInStaff) {
        return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
      }
      student.username = username;
    }

    if (password) {
      student.password = password; // Pre-save hook hashes this
    }

    if (loginEnabled !== undefined) {
      student.loginEnabled = loginEnabled;
    }

    await student.save();
    return NextResponse.json({ 
      message: 'Student login updated successfully', 
      student: { 
        _id: student._id, 
        username: student.username, 
        loginEnabled: student.loginEnabled 
      } 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

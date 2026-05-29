import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Staff from '@/models/Staff';
import Student from '@/models/Student';
import User from '@/models/User';
import { applyPortalCredentials } from '@/lib/credentials';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { username, password, loginEnabled } = await request.json();

    const staff = await Staff.findById(id);
    if (!staff) {
      return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
    }

    if (username) {
      const existsInStaff = await Staff.findOne({ username, _id: { $ne: id } });
      const existsInStudent = await Student.findOne({ username });
      const existsInUser = await User.findOne({ username });

      if (existsInStaff || existsInStudent || existsInUser) {
        return NextResponse.json({ message: 'Username is already taken' }, { status: 400 });
      }
    }

    applyPortalCredentials(staff, { username, password, loginEnabled });

    await staff.save();
    return NextResponse.json({ 
      message: 'Staff login updated successfully', 
      staff: { 
        _id: staff._id, 
        username: staff.username, 
        loginEnabled: staff.loginEnabled 
      } 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

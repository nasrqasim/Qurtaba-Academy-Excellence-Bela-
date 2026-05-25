import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Student from '@/models/Student';
import Staff from '@/models/Staff';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id || !decoded.role) {
      return NextResponse.json({ message: 'Invalid session token' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
    }

    let account: any = null;
    if (decoded.role === 'Super Admin' || decoded.role === 'Admin') {
      account = await User.findById(decoded.id);
    } else if (decoded.role === 'Student') {
      account = await Student.findById(decoded.id);
    } else if (decoded.role === 'Teacher' || decoded.role === 'Staff') {
      account = await Staff.findById(decoded.id);
    }

    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
    }

    // Update password
    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

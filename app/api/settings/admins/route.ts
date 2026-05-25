import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const admins = await User.find({ role: { $in: ['Super Admin', 'Admin'] } }).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(admins, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Check if user already exists
    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    if (body.username) {
      const existingUsername = await User.findOne({ username: body.username });
      if (existingUsername) {
        return NextResponse.json({ message: 'User with this username already exists' }, { status: 400 });
      }
    }

    const admin = new User({
      name: body.name || body.fullName,
      email: body.email,
      password: body.password,
      phone: body.phone,
      username: body.username,
      role: body.role || 'Admin',
      status: body.status || 'Active',
      profileImage: body.profileImage
    });

    await admin.save();
    
    const adminObj = admin.toObject();
    delete adminObj.password;

    return NextResponse.json(adminObj, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

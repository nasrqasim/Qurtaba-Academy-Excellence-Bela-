import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const admin = await User.findById(id).select('-password');
    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }
    return NextResponse.json(admin, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const admin = await User.findById(id);
    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    if (body.name) admin.name = body.name;
    if (body.email) {
      const existing = await User.findOne({ email: body.email, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
      }
      admin.email = body.email;
    }
    if (body.username) {
      const existing = await User.findOne({ username: body.username, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ message: 'Username already in use' }, { status: 400 });
      }
      admin.username = body.username;
    }
    if (body.phone) admin.phone = body.phone;
    if (body.role) admin.role = body.role;
    if (body.status) admin.status = body.status;
    if (body.profileImage) admin.profileImage = body.profileImage;
    
    if (body.password) {
      admin.password = await bcrypt.hash(body.password, 10);
    }

    await admin.save();
    
    const adminObj = admin.toObject();
    delete adminObj.password;

    return NextResponse.json(adminObj, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Admin deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

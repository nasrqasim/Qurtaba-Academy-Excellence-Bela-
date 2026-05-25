import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Student from '@/models/Student';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { action } = await request.json();

    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    if (action === 'verify') {
      student.isVerified = true;
      if (!student.verificationId) {
        const currentYear = new Date().getFullYear();
        const randomHash = Math.random().toString(36).substring(2, 7).toUpperCase();
        student.verificationId = `QSEB-${currentYear}-${randomHash}`;
      }
      student.verificationDate = new Date();
    } else if (action === 'remove') {
      student.isVerified = false;
      student.verificationId = undefined;
      student.verificationDate = undefined;
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    await student.save();

    return NextResponse.json({
      message: `Student verification updated successfully`,
      student
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

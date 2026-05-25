import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Student from '@/models/Student';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();

    if (!search) {
      return NextResponse.json({ verified: false, message: 'Search parameter is required' }, { status: 400 });
    }

    // Lookup student by Admission Number (Roll Number), CNIC / B-Form, or Verification ID
    const student = await Student.findOne({
      $or: [
        { admissionNumber: { $regex: `^${search}$`, $options: 'i' } },
        { cnic: { $regex: `^${search}$`, $options: 'i' } },
        { verificationId: { $regex: `^${search}$`, $options: 'i' } }
      ]
    });

    if (!student) {
      return NextResponse.json({ verified: false, message: 'No student found' }, { status: 200 });
    }

    if (!student.isVerified) {
      return NextResponse.json({ verified: false, message: 'Student is not verified' }, { status: 200 });
    }

    return NextResponse.json({
      verified: true,
      student: {
        fullName: student.fullName,
        fatherName: student.fatherName,
        class: student.class,
        admissionNumber: student.admissionNumber,
        admissionDate: student.admissionDate,
        schoolName: 'Qurtaba School of Excellence Bela',
        verificationId: student.verificationId,
        verificationDate: student.verificationDate,
        isVerified: true,
        image: student.image
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ verified: false, message: error.message }, { status: 500 });
  }
}

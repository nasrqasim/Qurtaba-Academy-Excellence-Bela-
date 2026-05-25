import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Student from '@/models/Student';
import Staff from '@/models/Staff';
import Admission from '@/models/Admission';
import Class from '@/models/Class';
import Fee from '@/models/Fee';
import Notification from '@/models/Notification';

export async function GET() {
  try {
    await connectDB();

    const [
      totalStudents,
      totalTeachers,
      totalStaff,
      totalClasses,
      pendingAdmissions,
      notificationsCount,
      fees
    ] = await Promise.all([
      Student.countDocuments(),
      Staff.countDocuments({ department: 'Academic' }),
      Staff.countDocuments(),
      Class.countDocuments(),
      Admission.countDocuments({ status: 'Pending' }),
      Notification.countDocuments(),
      Fee.find({ status: 'Paid' }).select('amount').lean()
    ]);

    const feeCollections = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const totalRevenue = feeCollections; // Can be expanded with other revenues

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalStaff,
      totalClasses,
      pendingAdmissions,
      totalRevenue,
      feeCollections,
      notificationsCount
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

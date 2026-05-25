import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Payroll from '@/models/Payroll';
import Staff from '@/models/Staff';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id || (decoded.role !== 'Staff' && decoded.role !== 'Teacher')) {
      return NextResponse.json({ message: 'Invalid session or unauthorized' }, { status: 401 });
    }

    const staffMember = await Staff.findById(decoded.id);
    if (!staffMember) {
      return NextResponse.json({ message: 'Staff profile not found' }, { status: 404 });
    }

    const records = await Payroll.find({ employeeId: staffMember.empId }).sort({ createdAt: -1 });

    return NextResponse.json({
      salary: staffMember.salary,
      status: staffMember.status,
      history: records
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

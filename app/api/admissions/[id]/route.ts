import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admission from '@/models/Admission';
import Student from '@/models/Student';
import { generateAdmissionNumber } from '@/lib/admission';
import { formatDbConnectionError } from '@/lib/db-error';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const admission = await Admission.findById(id).lean();
    if (!admission) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json(admission, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to load application';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const admission = await Admission.findById(id);
    if (!admission) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    admission.status = status;
    await admission.save();

    if (status === 'Approved') {
      const orConditions: Record<string, string>[] = [{ phone: admission.phone }];
      if (admission.email) orConditions.push({ email: admission.email });
      const existing = await Student.findOne({ $or: orConditions });

      if (!existing) {
        await Student.create({
          fullName: admission.fullName,
          fatherName: admission.fatherName,
          motherName: admission.motherName,
          cnic: admission.cnic,
          dob: admission.dob,
          gender: admission.gender,
          address: admission.address,
          phone: admission.phone,
          email: admission.email,
          program: admission.appliedProgram,
          class: admission.appliedClass,
          image: admission.image,
          documents: admission.documents || [],
          previousSchool: admission.previousSchool,
          status: 'Active',
          admissionNumber: generateAdmissionNumber(),
          admissionDate: admission.appliedDate || new Date(),
        });
      }
    }

    return NextResponse.json(
      { message: `Application ${status.toLowerCase()}`, admission },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = formatDbConnectionError(error);
    const detail = error instanceof Error && !message.includes('MongoDB') ? error.message : message;
    return NextResponse.json({ message: detail }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const admission = await Admission.findByIdAndDelete(id);
    if (!admission) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Application deleted' }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete application';
    return NextResponse.json({ message }, { status: 500 });
  }
}

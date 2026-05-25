import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import RolePermission from '@/models/RolePermission';

const DEFAULT_PERMISSIONS = [
  { role: 'Super Admin', permissions: ['all', 'Add/Edit/Delete Students', 'Manage Fees', 'Manage Payroll', 'Manage Admissions', 'Manage Results', 'Manage Notifications'] },
  { role: 'Admin', permissions: ['Add/Edit/Delete Students', 'Manage Fees', 'Manage Payroll', 'Manage Admissions', 'Manage Results', 'Manage Notifications'] },
  { role: 'Teacher', permissions: ['Manage Results'] },
  { role: 'Staff', permissions: ['Manage Results'] },
  { role: 'Student', permissions: [] }
];

export async function GET() {
  try {
    await connectDB();
    let perms = await RolePermission.find();
    if (perms.length === 0) {
      // Seed default permissions
      perms = await RolePermission.insertMany(DEFAULT_PERMISSIONS);
    }
    return NextResponse.json(perms, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { role, permissions } = await request.json();

    if (!role) {
      return NextResponse.json({ message: 'Role is required' }, { status: 400 });
    }

    let rolePerm = await RolePermission.findOne({ role });
    if (!rolePerm) {
      rolePerm = new RolePermission({ role, permissions });
    } else {
      rolePerm.permissions = permissions;
    }

    await rolePerm.save();
    return NextResponse.json({ message: 'Permissions updated successfully', rolePerm }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

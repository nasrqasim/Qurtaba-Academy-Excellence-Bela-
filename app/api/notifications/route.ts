import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { buildPaginationMeta, parsePagination } from '@/lib/pagination';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams, 20, 100);

    if (pagination) {
      const [notifications, total] = await Promise.all([
        Notification.find()
          .sort({ createdAt: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit)
          .lean(),
        Notification.countDocuments(),
      ]);
      return NextResponse.json({
        data: notifications,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit),
      });
    }

    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json(notifications, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const notification = await Notification.create(data);
    return NextResponse.json(
      { message: 'Notification created successfully', notification },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create notification';
    return NextResponse.json({ message }, { status: 500 });
  }
}

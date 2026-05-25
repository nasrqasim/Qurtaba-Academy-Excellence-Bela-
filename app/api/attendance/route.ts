import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Attendance from '@/models/Attendance';
import Student from '@/models/Student';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI as string);
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const dateQuery = url.searchParams.get('date');
    const classQuery = url.searchParams.get('class');
    
    let filter: any = {};
    if (dateQuery) {
        const start = new Date(dateQuery);
        start.setHours(0,0,0,0);
        const end = new Date(dateQuery);
        end.setHours(23,59,59,999);
        filter.date = { $gte: start, $lte: end };
    }
    if (classQuery) {
        filter.class = classQuery;
    }
    
    const records = await Attendance.find(filter).populate('studentId', 'fullName admissionNumber class section').sort({ createdAt: -1 });
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (Array.isArray(body)) {
       const results = await Promise.all(body.map(async (record) => {
          const start = new Date(record.date);
          start.setHours(0,0,0,0);
          const end = new Date(record.date);
          end.setHours(23,59,59,999);
          
          return await Attendance.findOneAndUpdate(
             { studentId: record.studentId, date: { $gte: start, $lte: end } },
             { ...record },
             { upsert: true, new: true }
          );
       }));
       return NextResponse.json(results);
    } else {
        const record = await Attendance.create(body);
        return NextResponse.json(record);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}

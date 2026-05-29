import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SystemSettings from '@/models/SystemSettings';

export async function GET() {
  try {
    await connectDB();
    let settings = await SystemSettings.findOne();
    if (!settings) {
      // Seed default settings
      settings = await SystemSettings.create({
        schoolName: 'Qurtaba School of Excellence Bela',
        schoolLogo: 'logo.jpg',
        schoolEmail: 'info@qurtaba.edu.pk',
        phone: '+923312493233',
        address: 'Qurtaba Academy of excellence bela Near AC Office bela,Lasbela',
        footerText: '© 2026 Qurtaba School of Excellence Bela. All Rights Reserved.',
        themeColor: '#3525cd'
      });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(body);
    } else {
      if (body.schoolName) settings.schoolName = body.schoolName;
      if (body.schoolLogo) settings.schoolLogo = body.schoolLogo;
      if (body.schoolEmail) settings.schoolEmail = body.schoolEmail;
      if (body.phone) settings.phone = body.phone;
      if (body.address) settings.address = body.address;
      if (body.footerText) settings.footerText = body.footerText;
      if (body.themeColor) settings.themeColor = body.themeColor;
    }
    
    await settings.save();
    return NextResponse.json(settings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

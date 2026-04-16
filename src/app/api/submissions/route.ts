import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Extract IP and UA for logging
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';

    const submission = await Submission.create({
      ...data,
      ipAddress: ip,
      userAgent: ua
    });

    return NextResponse.json({ success: true, id: submission._id });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    // Basic auth check for admin will be added here or in middleware
    const submissions = await Submission.find({}).sort({ createdAt: -1 });
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    
    const submission = await Submission.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

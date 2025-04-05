import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email });
    
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json({ error: 'Error checking email' }, { status: 500 });
  }
}
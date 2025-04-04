import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();
    
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Email, username, and password are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'User with this email or username already exists' },
        { status: 400 }
      );
    }
    
    const user = await User.create({
      email,
      username,
      password,
      displayName: username,
      level: 1,
      xp: 0,
      contributions: 0
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Registration failed';
    console.error('Registration error:', errMsg);
    
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
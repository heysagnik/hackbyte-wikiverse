import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();
    
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Email, username, and password are required' },
        { status: 400 }
      );
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { success: false, message: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (userExists) {
      if (userExists.email === email) {
        return NextResponse.json(
          { success: false, message: 'User with this email already exists' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: 'This username is already taken' },
          { status: 400 }
        );
      }
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      displayName: username,
      level: 1,
      xp: 0,
      contributions: 0,
      achievements: [
        {
          id: 'new_guardian',
          name: 'New Guardian',
          description: 'Joined the Wiki Guardian community',
          unlockedAt: new Date()
        }
      ]
    });
    
    const savedUser = await newUser.save();
    
    // Use NEXTAUTH_SECRET for compatibility with NextAuth
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      // Instead of throwing an error, return a proper response
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const token = jwt.sign(
      { 
        userId: savedUser._id.toString(),
        email: savedUser.email,
        username: savedUser.username
      },
      secret,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'User registered and logged in successfully',
        user: {
          id: savedUser._id.toString(),
          email: savedUser.email,
          username: savedUser.username,
          displayName: savedUser.displayName,
          level: savedUser.level,
          xp: savedUser.xp,
          hasCompletedOnboarding: savedUser.hasCompletedOnboarding,
        },
        token
      },
      { status: 201 }
    );
    
    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
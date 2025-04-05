import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user email from session
    const userEmail = session.user.email;
    
    // Connect to the database
    await connectToDatabase();
    
    // Find the user
    const user = await User.findOne({ email: userEmail }).lean() as {
      settings?: {
        darkMode: boolean;
        highContrast: boolean;
        shareProgress: boolean;
        language: string;
        wikipediaConnected: boolean;
      }
    } | null;
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the settings
    // If the user doesn't have settings yet, return defaults
    return NextResponse.json({
      success: true,
      settings: user.settings || {
        darkMode: false,
        highContrast: false,
        shareProgress: true,
        language: 'en',
        wikipediaConnected: false
      }
    });
    
  } catch (error) {
    console.error('Error fetching user settings:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch user settings';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the user session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user email from session
    const userEmail = session.user.email;
    
    // Get settings from request body
    const data = await request.json();
    
    if (!data.settings) {
      return NextResponse.json(
        { success: false, message: 'No settings provided' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();
    
    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { settings: data.settings } },
      { new: true }
    ).lean();
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: Array.isArray(updatedUser) ? updatedUser[0].settings : updatedUser.settings
    });
    
  } catch (error) {
    console.error('Error updating user settings:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to update user settings';
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}


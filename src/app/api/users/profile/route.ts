import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// Add this GET handler to support fetching profile data
export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get user email from session
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'User email not found in session' },
        { status: 400 }
      );
    }
    
    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user profile data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        interests: user.interests,
        avatarId: user.avatarId,
        learningPath: user.learningPath,
        hasCompletedOnboarding: user.hasCompletedOnboarding || false,
        level: user.level || 1
      }
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch profile';
    console.error('Error fetching profile:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { displayName, username, bio, interests, avatarId, learningPath, hasCompletedOnboarding } = await request.json();

    // Get user by email since we don't have ID in the session
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'User email not found in session' },
        { status: 400 }
      );
    }
    
    // Find the user by email first
    const existingUser = await User.findOne({ email: userEmail });
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found with the provided email' },
        { status: 404 }
      );
    }
    
    const userId = existingUser._id;
    
    // Check if username is already taken by another user
    if (username) {
      const usernameExists = await User.findOne({ 
        username, 
        _id: { $ne: userId } // exclude current user
      });
      
      if (usernameExists) {
        return NextResponse.json(
          { success: false, message: 'Username already taken' },
          { status: 400 }
        );
      }
    }
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          displayName: displayName || undefined,
          username: username || undefined,
          bio: bio || undefined,
          interests: interests || undefined,
          avatarId: avatarId || undefined,
          learningPath: learningPath || undefined,
          hasCompletedOnboarding: hasCompletedOnboarding || undefined
        }
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
        interests: updatedUser.interests,
        avatarId: updatedUser.avatarId,
        learningPath: updatedUser.learningPath
      }
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to update profile';
    console.error('Error updating profile:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}
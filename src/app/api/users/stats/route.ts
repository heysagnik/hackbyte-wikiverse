import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find user by email instead of ID since email is always in the session
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Find the user using their email
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate next level threshold
    const currentLevelXP = 500 * Math.pow(user.level, 1.5);
    const nextLevelXP = 500 * Math.pow(user.level + 1, 1.5);
    const levelProgress = Math.floor(
      ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    );

    return NextResponse.json({
      success: true,
      edits: user.contributions || 0,
      editsThisWeek: Math.floor(user.contributions * 0.2) || 0, // Placeholder
      xp: user.xp || 0,
      level: user.level || 1,
      levelProgress: levelProgress || 0,
      activeQuests: 2, // Placeholder
      completedQuests: 5, // Placeholder
      articlesWatched: 12, // Placeholder
      articlesUpdated: 3 // Placeholder
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch user stats';
    console.error('Error in GET /api/users/stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
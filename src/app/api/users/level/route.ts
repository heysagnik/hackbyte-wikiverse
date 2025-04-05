import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { calculateLevel, getLevelInfo, LEVEL_THRESHOLDS } from '@/lib/levels';
import { isStreakActive, updateStreak } from '@/lib/streaks';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetch user's level, XP, and streak information
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'User email not found in session' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    const totalXP = user.totalXP || 0;
    const levelInfo = getLevelInfo(totalXP);
    
    // Add streak information
    const streakActive = user.lastStreakUpdate ? isStreakActive(user.lastStreakUpdate) : false;
    
    return NextResponse.json({
      success: true,
      ...levelInfo,
      streak: user.streak || 0,
      lastStreakUpdate: user.lastStreakUpdate || null,
      streakActive
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch level data';
    console.error('Error fetching level data:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

/**
 * POST: Add XP to user's account, update level, and manage streak
 * Body: { xpToAdd: number, updateStreak: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { xpToAdd, updateUserStreak = true } = await request.json();
    
    if (typeof xpToAdd !== 'number' || xpToAdd < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid XP value' },
        { status: 400 }
      );
    }
    
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'User email not found in session' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Calculate level before adding XP
    const oldXP = user.totalXP || 0;
    const oldLevel = calculateLevel(oldXP);
    
    // Add XP to user
    user.totalXP = oldXP + xpToAdd;
    
    // Calculate new level
    const newLevel = calculateLevel(user.totalXP);
    const leveledUp = newLevel > oldLevel;
    
    // Update user's level if changed
    if (leveledUp) {
      user.level = newLevel;
    }
    
    // Update streak if requested
    let streakData = {
      streak: user.streak || 0,
      lastStreakUpdate: user.lastStreakUpdate || null,
      streakUpdated: false
    };
    
    if (updateUserStreak) {
      streakData = updateStreak(user.streak || 0, user.lastStreakUpdate || null);
      user.streak = streakData.streak;
      user.lastStreakUpdate = streakData.lastStreakUpdate;
    }
    
    await user.save();
    
    // Get full level info for response
    const levelInfo = getLevelInfo(user.totalXP);
    
    return NextResponse.json({
      success: true,
      xpAdded: xpToAdd,
      leveledUp,
      oldLevel,
      ...levelInfo,
      streak: user.streak,
      lastStreakUpdate: user.lastStreakUpdate,
      streakUpdated: streakData.streakUpdated
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to update XP';
    console.error('Error updating XP:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}
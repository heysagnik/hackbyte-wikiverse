import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// Helper function to check if the streak is still active
function isStreakActive(lastCheckIn: Date | null): boolean {
  if (!lastCheckIn) return false;
  
  const now = new Date();
  const lastMidnight = new Date(now);
  lastMidnight.setHours(0, 0, 0, 0);
  
  const checkInDate = new Date(lastCheckIn);
  const checkInMidnight = new Date(checkInDate);
  checkInMidnight.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days between the last check-in and today
  const timeDiff = lastMidnight.getTime() - checkInMidnight.getTime();
  const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
  
  // Streak is active if the last check-in was today or yesterday
  return dayDiff <= 1;
}

// Helper function to update streak based on last check-in
function updateStreak(currentStreak: number, lastCheckIn: Date | null) {
  const now = new Date();
  
  if (!lastCheckIn) {
    // First time check-in
    return {
      streak: 1,
      lastCheckIn: now,
      streakUpdated: true
    };
  }
  
  const lastCheckInDate = new Date(lastCheckIn);
  const lastCheckInMidnight = new Date(lastCheckInDate);
  lastCheckInMidnight.setHours(0, 0, 0, 0);
  
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const timeDiff = todayMidnight.getTime() - lastCheckInMidnight.getTime();
  const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
  
  if (dayDiff === 0) {
    // Already checked in today
    return {
      streak: currentStreak,
      lastCheckIn: lastCheckIn,
      streakUpdated: false
    };
  } else if (dayDiff === 1) {
    // Consecutive day, increment streak
    return {
      streak: currentStreak + 1,
      lastCheckIn: now,
      streakUpdated: true
    };
  } else {
    // Streak broken, start new streak
    return {
      streak: 1,
      lastCheckIn: now,
      streakUpdated: true
    };
  }
}

/**
 * GET: Fetch user's current streak information
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
    
    // Calculate if streak is still active
    const streakActive = isStreakActive(user.lastCheckIn);
    
    return NextResponse.json({
      success: true,
      streak: user.streak || 0,
      lastCheckIn: user.lastCheckIn || null,
      streakActive,
      checkIns: user.checkIns || []
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to fetch streak data';
    console.error('Error fetching streak data:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}

/**
 * POST: Update user streak and award XP bonus
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
    
    // Check if streak is already active today
    const currentStreakActive = isStreakActive(user.lastCheckIn);
    
    if (currentStreakActive) {
      return NextResponse.json({
        success: true,
        message: 'Already checked in today',
        streak: user.streak || 0,
        streakActive: true,
        xpAwarded: 0
      });
    }
    
    // Update the streak
    const streakData = updateStreak(user.streak || 0, user.lastCheckIn || null);
    let xpAwarded = 0;
    
    // Award XP bonus based on streak length
    if (streakData.streakUpdated) {
      // Base XP for any check-in
      xpAwarded = 5;
      
      // Bonus XP for milestone streaks
      if (streakData.streak % 7 === 0) {
        // Weekly bonus (7, 14, 21 days, etc)
        xpAwarded += 25;
      } else if (streakData.streak % 30 === 0) {
        // Monthly bonus (30, 60, 90 days, etc)
        xpAwarded += 100;
      } else if (streakData.streak % 365 === 0) {
        // Yearly bonus
        xpAwarded += 500;
      }
      
      // Update user
      user.streak = streakData.streak;
      user.lastCheckIn = streakData.lastCheckIn;
      
      // Add the streak XP to totalXP
      user.totalXP = (user.totalXP || 0) + xpAwarded;
      
      await user.save();
    }
    
    return NextResponse.json({
      success: true,
      streak: user.streak,
      lastCheckIn: user.lastCheckIn,
      streakUpdated: streakData.streakUpdated,
      streakActive: true,
      xpAwarded
    });
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Failed to update streak';
    console.error('Error updating streak:', errMsg);
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}
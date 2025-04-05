/**
 * Utility for managing user streaks
 */

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculate if the streak is still active based on last activity date
 * @param lastActivityDate Date of the user's last activity
 * @returns Boolean indicating if the streak is still active
 */
export function isStreakActive(lastActivityDate: Date): boolean {
  const now = new Date();
  const lastMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  
  const timeSinceLastActivity = lastMidnight - lastActivityDate.getTime();
  
  // If the last activity was yesterday or today, the streak is active
  return timeSinceLastActivity <= MILLISECONDS_IN_DAY;
}

/**
 * Update a user's streak
 * @param currentStreak Current streak count
 * @param lastActivityDate Date of the user's last streak-eligible activity
 * @returns Object with updated streak information
 */
export function updateStreak(currentStreak: number, lastActivityDate: Date | null): {
  streak: number;
  lastStreakUpdate: Date;
  streakUpdated: boolean;
} {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  
  // If no previous activity, start streak at 1
  if (!lastActivityDate) {
    return {
      streak: 1,
      lastStreakUpdate: today,
      streakUpdated: true
    };
  }
  
  // Convert to date objects without time
  const lastActivityDay = new Date(
    lastActivityDate.getFullYear(),
    lastActivityDate.getMonth(),
    lastActivityDate.getDate()
  );
  
  // Calculate the difference in days
  const dayDifference = Math.floor(
    (today.getTime() - lastActivityDay.getTime()) / MILLISECONDS_IN_DAY
  );
  
  // Same day - no streak change
  if (dayDifference === 0) {
    return {
      streak: currentStreak,
      lastStreakUpdate: lastActivityDate,
      streakUpdated: false
    };
  }
  
  // Activity was yesterday - streak increases
  if (dayDifference === 1) {
    return {
      streak: currentStreak + 1,
      lastStreakUpdate: today,
      streakUpdated: true
    };
  }
  
  // More than one day - streak resets
  return {
    streak: 1,
    lastStreakUpdate: today,
    streakUpdated: true
  };
}
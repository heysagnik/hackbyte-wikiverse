/**
 * Utility for managing level progression and XP requirements
 */

// Define XP thresholds for each level
export const LEVEL_THRESHOLDS = [
  0,      // Level 1 starts at 0 XP
  300,    // Level 2 requires 300 XP
  800,    // Level 3 requires 800 XP (500 more than level 2)
  1500,   // Level 4 requires 1500 XP (700 more than level 3)
  2500,   // Level 5 requires 2500 XP (1000 more than level 4)
  4000,   // Level 6 requires 4000 XP (1500 more than level 5)
  6000,   // Level 7 requires 6000 XP (2000 more than level 6)
  9000,   // Level 8 requires 9000 XP (3000 more than level 7)
  13000,  // Level 9 requires 13000 XP (4000 more than level 8)
  18000   // Level 10 requires 18000 XP (5000 more than level 9)
];

// Maximum level in the system
export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

/**
 * Calculate user level based on XP
 * @param xp Total XP the user has earned
 * @returns The user's current level
 */
export function calculateLevel(xp: number): number {
  // Default to level 1
  if (xp < LEVEL_THRESHOLDS[1]) return 1;
  
  // Find the highest level threshold that the user's XP exceeds
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  
  return 1; // Fallback to level 1
}

/**
 * Get information about level progression
 * @param xp Total XP the user has earned
 * @returns Object with level info
 */
export function getLevelInfo(xp: number) {
  const currentLevel = calculateLevel(xp);
  const nextLevel = currentLevel < MAX_LEVEL ? currentLevel + 1 : currentLevel;
  
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextLevelXP = LEVEL_THRESHOLDS[nextLevel - 1];
  
  const xpForNextLevel = nextLevelXP;
  const xpProgress = xp - currentLevelXP;
  const xpRequired = nextLevelXP - currentLevelXP;
  const progressPercent = currentLevel < MAX_LEVEL 
    ? Math.min(100, Math.floor((xpProgress / xpRequired) * 100))
    : 100;
  
  return {
    currentLevel,
    currentLevelXP,
    nextLevel,
    nextLevelXP,
    xpForNextLevel,
    xpRequired,
    xpProgress,
    progressPercent,
    totalXP: xp,
    maxLevel: currentLevel >= MAX_LEVEL
  };
}
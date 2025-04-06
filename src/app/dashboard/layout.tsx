"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Type definitions
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

interface UserProfile {
  displayName: string;
  level: number;
  initial: string;
  hasCompletedOnboarding: boolean;
  totalXP?: number;
  streak?: number;
  streakActive?: boolean; // Add this new property
}

// Custom nav item with a different style from Duolingo
const NavItem = ({ href, icon, label, isActive, isCollapsed }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center px-3 py-3.5 text-base rounded-2xl transition-all ${
      isActive
        ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold shadow-md"
        : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#6366F1]"
    }`}
  >
    <div className="w-6 h-6">{icon}</div>
    {!isCollapsed && <span className="ml-3 font-semibold truncate">{label}</span>}
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // User state with gamification fields
  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: "User",
    level: 1,
    initial: "U",
    hasCompletedOnboarding: false,
    totalXP: 0,
    streak: 0,
    streakActive: false
  });
  
  const [error, setError] = useState<string | null>(null);
  
  // Add this state variable to the component
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  
  // API fetch function with error handling
  const fetchWithErrorHandling = useCallback(async (url: string) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // Check for empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Expected JSON response but got a different content type');
      }
      
      const text = await response.text();
      if (!text || text.trim() === '') {
        throw new Error('Empty response from API');
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Error fetching ${url}:`, message);
      throw error;
    }
  }, []);

  // Calculate XP progress percentage based on level thresholds
  const calculateXpProgress = (totalXP: number, level: number) => {
    // Level 1 to Level 2 requires 300 XP
    if (level === 1) {
      return Math.min((totalXP / 300) * 100, 100);
    }
    
    // Level 2 to Level 3 requires 500 more XP (total 800)
    if (level === 2) {
      const levelProgress = totalXP - 300;
      return Math.min((levelProgress / 500) * 100, 100);
    }
    
    // Higher levels - use a default formula
    const previousLevelXP = level === 1 ? 0 : level === 2 ? 300 : 800;
    const nextLevelXP = level === 1 ? 300 : level === 2 ? 800 : previousLevelXP + 1000;
    const levelProgress = totalXP - previousLevelXP;
    const requiredForNextLevel = nextLevelXP - previousLevelXP;
    
    return Math.min((levelProgress / requiredForNextLevel) * 100, 100);
  };

  // Check user's onboarding status and set profile
  useEffect(() => {
    const loadUserProfile = async () => {
      // Load user profile without exposing internal debug logs
      
      if (status === "loading") {
        return;
      }
      
      if (status === "unauthenticated") {
        router.push("/");
        return;
      }
      
      if (status === "authenticated" && session?.user) {
        try {
          const displayName =
            (session.user as any).name ||
            (session.user as any).username ||
            "User";
          // Set basic profile information
          setUserProfile(prev => ({
            ...prev,
            displayName,
            initial: displayName.charAt(0).toUpperCase(),
            level: (session.user as any).level || 1,
            totalXP: (session.user as any).totalXP || 0,
            streak: (session.user as any).streak || 0,
            streakActive: (session.user as any).streakActive || false
          }));
          
          // Fetch additional profile data asynchronously
          try {
            const profileData = await fetchWithErrorHandling('/api/users/profile');
            
            const levelData = await fetchWithErrorHandling('/api/users/level');
            
            setUserProfile(prev => ({
              ...prev,
              hasCompletedOnboarding: true,
              level: levelData.success ? levelData.currentLevel : (profileData.user?.level || prev.level),
              totalXP: levelData.success ? levelData.totalXP : (profileData.user?.totalXP || prev.totalXP),
              streak: levelData.success ? levelData.streak : (profileData.user?.streak || prev.streak),
              streakActive: levelData.success ? levelData.streakActive : true
            }));
            
            try {
              const streakData = await fetchWithErrorHandling('/api/users/streak');
              if (streakData.success && streakData.lastCheckIn) {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                
                const lastCheckIn = new Date(streakData.lastCheckIn);
                const lastCheckInDay = new Date(
                  lastCheckIn.getFullYear(),
                  lastCheckIn.getMonth(),
                  lastCheckIn.getDate()
                ).getTime();
                
                setIsCheckedInToday(lastCheckInDay === today);
              }
            } catch (error) {
              console.error("Error checking check-in status:", error);
            }
            
          } catch (apiError) {
            console.error("Error fetching profile:", apiError);
          }
        } catch (err) {
          console.error("Error in profile setup:", err);
          setError("Something went wrong. Please try again.");
        }
      }
    };
    
    loadUserProfile();
  }, [session, status, router, fetchWithErrorHandling]);

  // Sync streak count regularly to keep it up-to-date across pages.
  useEffect(() => {
    const syncStreak = async () => {
      try {
        const streakData = await fetchWithErrorHandling('/api/users/streak');
        if (streakData.success) {
          setUserProfile(prev => ({
            ...prev,
            streak: streakData.streak ?? prev.streak,
            streakActive: streakData.streakActive ?? prev.streakActive
          }));
          if (streakData.lastCheckIn) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const lastCheckIn = new Date(streakData.lastCheckIn);
            const lastCheckInDay = new Date(lastCheckIn.getFullYear(), lastCheckIn.getMonth(), lastCheckIn.getDate()).getTime();
            setIsCheckedInToday(lastCheckInDay === today);
          }
        }
      } catch (error) {
        console.error("Error syncing streak data:", error);
      }
    };

    // Initial sync and every 60 seconds
    syncStreak();
    const intervalId = setInterval(syncStreak, 60000);
    return () => clearInterval(intervalId);
  }, [fetchWithErrorHandling]);

  // Listen for visibility changes to mark user as active when page is focused,
  // and inactive when not.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetch('/api/users/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: true })
        }).catch(err => console.error("Error marking active:", err));
      } else {
        fetch('/api/users/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: false })
        }).catch(err => console.error("Error marking inactive:", err));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E5E7EB] rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#6366F1] rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-[#4B5563] font-bold">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  // Show error message if there was an error loading profile
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="bg-[#FEF2F2] border-2 border-[#F87171] text-[#B91C1C] p-6 rounded-xl max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto mb-4">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <h2 className="font-extrabold text-xl mb-2">Oops! Something went wrong</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#F87171] text-white px-6 py-3 rounded-xl font-extrabold hover:bg-[#ef4444] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#F9FAFB] text-[#1F2937]">
      {/* Modern Sidebar */}
      <aside
        className={`h-screen flex-shrink-0 bg-white border-r border-[#E5E7EB] transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/dashboard" className="font-extrabold text-xl text-[#6366F1] truncate flex items-center">
              <svg viewBox="0 0 24 24" width="28" height="28" className="mr-2" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" fill="#6366F1" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.75 15L12 19.25L19.25 15" fill="#8B5CF6" fillOpacity="0.5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.75 9V15" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.25 9V15" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13.5V19.25" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Wikiverse
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 text-[#6366F1] hover:text-[#4F46E5] flex-shrink-0 bg-[#EEF2FF] rounded-lg flex items-center justify-center transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Progress Cards */}
        {!isCollapsed && (
          <div className="p-4 border-b border-[#E5E7EB] space-y-3">
            {/* Level and XP */}
            <div className="bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </div>
                  <span className="font-bold text-[#4B5563]">Level {userProfile.level}</span>
                </div>
                <span className="text-sm font-semibold text-[#6366F1]">{userProfile.totalXP || 0} XP</span>
              </div>
              <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] h-2.5 rounded-full" 
                  style={{ width: `${calculateXpProgress(userProfile.totalXP || 0, userProfile.level)}%` }}
                ></div>
              </div>
            </div>
            
            {/* Streak with active/inactive indicator */}
            <div className="bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA] rounded-lg p-3 flex flex-col">
              <div className="flex items-center mb-1">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 shadow-sm
                  ${userProfile.streakActive 
                    ? "bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white" 
                    : "bg-gray-400 text-white"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.545 5.975 5.975 0 0 1-2.133-1.001A6.004 6.004 0 0 1 12 18Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#4B5563]">
                    Daily Streak {userProfile.streakActive ? '(active)' : '(inactive)'}
                  </span>
                  {isCheckedInToday && (
                    <span className="text-xs text-[#58CC02]">✓ Checked in today</span>
                  )}
                </div>
              </div>
              <span className="font-bold text-[#92400E]">
                {userProfile.streak} days {userProfile.streakActive ? '🔥' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Navigation - Only keeping Home, Quests, Community, Settings */}
        <nav className="flex-1 py-4 px-3 space-y-3 overflow-y-auto">
          <NavItem
            href="/dashboard"
            isActive={pathname === "/dashboard"}
            isCollapsed={isCollapsed}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.432Z" />
              </svg>
            }
            label="Home"
          />
          <NavItem
            href="/dashboard/quests"
            isActive={pathname === "/dashboard/quests"}
            isCollapsed={isCollapsed}
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <polygon
                  points="12,2 17.88,3.91 21.51,8.91 21.51,15.09 17.88,20.09 12,22 6.12,20.09 2.49,15.09 2.49,8.91 6.12,3.91"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                  />
                </svg>
            }
            label="Quests"
          />
          <NavItem
            href="/dashboard/community"
            isActive={pathname === "/dashboard/community"}
            isCollapsed={isCollapsed}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
              </svg>
            }
            label="Community"
          />

          {/* New Shop button */}
          <NavItem
            href="/dashboard/shop"
            isActive={pathname === "/dashboard/shop"}
            isCollapsed={isCollapsed}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421l3.75-7.5a.75.75 0 0 0-.674-1.079H4.81l-.5-1.873A1.875 1.875 0 0 0 2.625 2.25H2.25Z" />
                <path d="M10.5 17.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.75 17.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            }
            label="Shop"
          />

          <NavItem
            href="/dashboard/settings"
            isActive={pathname === "/dashboard/settings"}
            isCollapsed={isCollapsed}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
              </svg>
            }
            label="Settings"
          />
        </nav>

        {/* Practice CTA Button - Add this new section */}
        <div className="px-3 mb-4 mt-auto">
          <Link 
            href="/dashboard/sandbox" 
            className={`flex items-center justify-center ${
              isCollapsed ? 'py-4' : 'py-3 px-4'
            } bg-gradient-to-r from-[#FF8A00] to-[#FF4E50] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 group`}
          >
            {isCollapsed ? (
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mb-1">
                  <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.545 5.975 5.975 0 0 1-2.133-1.001A6.004 6.004 0 0 1 12 18Z" />
                </svg>
                <span className="text-xs">Practice</span>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 group-hover:animate-bounce">
                  <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.545 5.975 5.975 0 0 1-2.133-1.001A6.004 6.004 0 0 1 12 18Z" />
                </svg>
                <span className="flex-grow text-center text-lg">Practice</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </Link>
        </div>

        {/* User profile */}
        <div className={`p-4 border-t border-[#E5E7EB] ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#EEF2FF] to-[#C7D2FE] rounded-lg flex items-center justify-center text-[#6366F1] flex-shrink-0 border border-[#C7D2FE]">
                <span className="font-extrabold text-base">{userProfile.initial}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full border border-white"></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold truncate text-[#1F2937]">{userProfile.displayName}</p>
                <div className="flex items-center text-xs">
                  <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-2 py-0.5 rounded-md font-bold">
                    Lvl {userProfile.level} • {userProfile.totalXP || 0} XP
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto relative pb-16 md:pb-0">
        {children}
        
        {/* Mobile Bottom Navigation - Only show Home, Quests, Community, Settings */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] py-3 px-5 grid grid-cols-4 gap-1 text-center z-50 md:hidden">
          <a href="/dashboard" className={`flex flex-col items-center ${pathname === "/dashboard" ? "text-[#6366F1]" : "text-[#4B5563]"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.432Z" />
            </svg>
            <span className="text-xs font-bold mt-1">Home</span>
          </a>
          <a href="/dashboard/quests" className={`flex flex-col items-center ${pathname === "/dashboard/quests" ? "text-[#6366F1]" : "text-[#4B5563]"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176A7.547 7.547 0 0 1 6.648 6.61a.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 16.09l.15.232a.75.75 0 0 0 1.138.21 9.746 9.746 0 0 0 2.354-3.998 9.75 9.75 0 0 0 .18-5.029.75.75 0 0 0-.728-.729 9.753 9.753 0 0 0-3.583.329 9.749 9.749 0 0 0-2.178-4.835Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold mt-1">Quests</span>
          </a>
          <a href="/dashboard/community" className={`flex flex-col items-center ${pathname === "/dashboard/community" ? "text-[#6366F1]" : "text-[#4B5563]"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
            <span className="text-xs font-bold mt-1">Community</span>
          </a>
          <a href="/dashboard/settings" className={`flex flex-col items-center ${pathname === "/dashboard/settings" ? "text-[#6366F1]" : "text-[#4B5563]"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold mt-1">Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}
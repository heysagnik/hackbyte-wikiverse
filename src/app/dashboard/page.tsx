"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DailyCheckIn from '@/components/dashboard/DailyCheckIn';

const COLORS = {
  primary: { from: "#58CC02", to: "#46A302" },
  secondary: { from: "#1CB0F6", to: "#0A91D3" },
  accent: { from: "#FF9600", to: "#E08600" },
  purple: { from: "#8549BA", to: "#7039A8" },
  yellow: { from: "#FFC800", to: "#FFAF00" },
  red: { from: "#FF4B4B", to: "#E63F3F" }
};

type Quest = { title: string; progress: number; total: number; };
type UserStats = {
  edits: number; editsThisWeek: number; xp: number; level: number; levelProgress: number;
  activeQuests: number; completedQuests: number; articlesWatched: number; articlesUpdated: number;
};

const Quests = ({ quests }: { quests: Quest[] }) => (
  <div className="space-y-5">
    {quests.length > 0 ? quests.map((quest, index) => (
      <div key={index} className="border-2 border-[#E5E7EB] p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-[#58CC02] transition-all duration-300">
        <div className="flex justify-between">
          <h3 className="font-extrabold text-[#4B5563]">{quest.title}</h3>
          <span className="text-xs px-2 py-1 bg-[#F1FFEB] text-[#58CC02] font-bold rounded-full border border-[#A6E772]">
            +{Math.floor(quest.total * 5)} XP
          </span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="w-full max-w-xs bg-[#F3F4F6] rounded-full h-2.5 overflow-hidden" role="progressbar" aria-valuenow={quest.progress} aria-valuemin={0} aria-valuemax={quest.total}>
            <div 
              className="bg-gradient-to-r from-[#58CC02] to-[#46A302] h-2.5 rounded-full transition-all duration-1000" 
              style={{ width: `${(quest.progress / quest.total) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-[#4B5563] ml-3">{quest.progress}/{quest.total}</span>
        </div>
      </div>
    )) : (
      <div className="text-center py-6 text-[#6B7280] bg-[#F1FFEB] rounded-lg border-2 border-dashed border-[#A6E772]">
        <p className="font-bold">No active quests.</p>
        <p>Complete lessons to unlock challenges!</p>
      </div>
    )}
  </div>
);

const fallbackQuests = [
  { title: "Add 3 citations to articles", progress: 1, total: 3 },
  { title: "Complete your first edit", progress: 0, total: 1 },
  { title: "Review an article draft", progress: 0, total: 1 }
];

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState<UserStats>({
    edits: 0, editsThisWeek: 0, xp: 0, level: 1, levelProgress: 0,
    activeQuests: 0, completedQuests: 0, articlesWatched: 0, articlesUpdated: 0
  });
  
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [username, setUsername] = useState("");
  const [streak, setStreak] = useState(0);
  const [streakActive, setStreakActive] = useState(false);
  const [levelData, setLevelData] = useState({
    currentLevel: 1,
    totalXP: 0,
    progressPercent: 0,
    xpForNextLevel: 300
  });
  const [checkingIn, setCheckingIn] = useState(false);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  const fetchData = useCallback(async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new Error(`Failed to fetch from ${url}: ${message}`);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        setUsername((session?.user as any)?.name || (session?.user as any)?.username || "User");
        
        // Fetch user stats
        try {
          const statsData = await fetchData('/api/users/stats');
          
          setUserStats({
            edits: statsData.edits || 0,
            editsThisWeek: statsData.editsThisWeek || 0,
            xp: statsData.xp || 0,
            level: statsData.level || 1,
            levelProgress: statsData.levelProgress || 0,
            activeQuests: statsData.activeQuests || 0,
            completedQuests: statsData.completedQuests || 0,
            articlesWatched: statsData.articlesWatched || 0,
            articlesUpdated: statsData.articlesUpdated || 0
          });
        } catch (statsError) {
          console.error("Failed to fetch stats:", statsError);
        }
        
        // Fetch quests
        try {
          const questsData = await fetchData('/api/quests/active');
          // Limit to 3 items
          setActiveQuests((questsData.quests || []).slice(0, 3));
        } catch (questsError) {
          console.error("Failed to fetch quests:", questsError);
        }

        // Fetch level and streak data
        try {
          const levelResponse = await fetch('/api/users/level');
          
          if (levelResponse.ok) {
            const levelData = await levelResponse.json();
            
            if (levelData.success) {
              setLevelData({
                currentLevel: levelData.currentLevel,
                totalXP: levelData.totalXP,
                progressPercent: levelData.progressPercent,
                xpForNextLevel: levelData.xpForNextLevel
              });
              
              setStreak(levelData.streak || 0);
              setStreakActive(levelData.streakActive || false);
              
              setUserStats(prevStats => ({
                ...prevStats,
                xp: levelData.totalXP,
                level: levelData.currentLevel,
                levelProgress: levelData.progressPercent
              }));
            }
          }
        } catch (levelError) {
          console.error("Failed to fetch level data:", levelError);
        }

        // Fetch streak data
        try {
          const streakResponse = await fetch('/api/users/streak');
          if (streakResponse.ok) {
            const streakData = await streakResponse.json();
            if (streakData.success) {
              setStreak(streakData.streak || 0);
              setStreakActive(streakData.streakActive || false);
              setTotalCheckIns(streakData.checkIns?.length || 0);
              
              // Determine if user already checked in today
              const now = new Date();
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
              
              if (streakData.lastCheckIn) {
                const lastCheckIn = new Date(streakData.lastCheckIn);
                const lastCheckInDay = new Date(
                  lastCheckIn.getFullYear(), 
                  lastCheckIn.getMonth(), 
                  lastCheckIn.getDate()
                ).getTime();
                
                setAlreadyCheckedIn(lastCheckInDay === today);
              }
            }
          }
        } catch (streakError) {
          console.error("Error fetching streak data:", streakError);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session, fetchData]);
  
  const handleCheckIn = async () => {
    if (checkingIn || alreadyCheckedIn) return;
    
    setCheckingIn(true);
    try {
      const response = await fetch('/api/users/streak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setStreak(data.streak);
          setStreakActive(true);
          setTotalCheckIns(data.totalCheckIns || 0);
          setAlreadyCheckedIn(true);
          
          if (data.xpAwarded) {
            setLevelData(prev => ({
              ...prev,
              totalXP: prev.totalXP + data.xpAwarded
            }));
            
            setUserStats(prev => ({
              ...prev,
              xp: prev.xp + data.xpAwarded
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error during check-in:", error);
    } finally {
      setCheckingIn(false);
    }
  };

  const displayQuests = useMemo(() => (
    activeQuests.length > 0 ? activeQuests : fallbackQuests.slice(0, 3)
  ), [activeQuests]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]" aria-live="polite" aria-busy="true">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E5E7EB] rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#58CC02] rounded-full animate-spin"></div>
        </div>
        <span className="sr-only">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="bg-[#FEF2F2] border border-[#FF4B4B] text-[#B91C1C] p-4 rounded-lg font-bold" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-[#FAFDF7]">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl text-[#1F2937] font-extrabold">
         Dashboard
        </h1>
        <div className="flex justify-between items-center mt-3">
          <p className="text-[#6B7280]">Welcome back, <span className="font-semibold">{username}</span></p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-[#FF9600] mr-1">🔥</span>
              <span className="font-bold">{streak} day streak</span>
              {alreadyCheckedIn && (
                <span className="ml-2 text-xs bg-[#F1FFEB] text-[#58CC02] px-2 py-0.5 rounded-full font-medium">
                  ✓ Today
                </span>
              )}
            </div>
            <div className="bg-[#58CC02] text-white px-3 py-1 rounded-full text-sm font-bold">
              {levelData.totalXP} XP
            </div>
          </div>
        </div>
      </header>

      {/* Redesigned Bento Grid with better fit */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Level Progress - Spans top row full width */}
        <div className="md:col-span-12 bg-gradient-to-r from-[#F1FFEB] to-[#E9FFD9] rounded-xl border-2 border-[#A6E772] p-4 flex flex-wrap md:flex-nowrap items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-[#58CC02] to-[#46A302] rounded-full flex items-center justify-center text-white mr-4 shadow-md">
              <span className="font-extrabold text-2xl">{levelData.currentLevel}</span>
            </div>
            <div className="flex-grow md:w-64">
              <h2 className="text-xl font-extrabold text-[#1F2937]">Level {levelData.currentLevel} Wiki Editor</h2>
              <div className="w-full bg-white rounded-full h-2.5 mt-2">
                <div 
                  className="bg-gradient-to-r from-[#58CC02] to-[#46A302] h-2.5 rounded-full" 
                  style={{ width: `${levelData.progressPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">{levelData.xpForNextLevel - levelData.totalXP} XP needed for Level {levelData.currentLevel + 1}</p>
            </div>
          </div>
          <div className="flex space-x-4 w-full md:w-auto justify-center">
            <div className="text-center">
              <span className="text-sm text-[#6B7280]">Edits</span>
              <p className="font-extrabold text-xl text-[#58CC02]">{userStats.edits}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-[#6B7280]">Quests</span>
              <p className="font-extrabold text-xl text-[#8549BA]">{userStats.completedQuests}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-[#6B7280]">Streak</span>
              <p className="font-extrabold text-xl text-[#FF9600]">{streak} days</p>
            </div>
          </div>
        </div>

        {/* Daily Check-In - 5 columns (larger portion) */}
        <div className="md:col-span-5">
          <DailyCheckIn 
            streak={streak}
            streakActive={streakActive}
            onCheckIn={handleCheckIn}
            isLoading={checkingIn}
            totalCheckIns={totalCheckIns}
            alreadyCheckedIn={alreadyCheckedIn}
          />
        </div>

        {/* Today's Quests - 7 columns (larger portion) */}
        <div className="md:col-span-7 bg-white border-2 border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#58CC02] transition-all duration-300">
          <h2 className="font-extrabold text-[#1F2937] text-xl mb-5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#58CC02" className="w-6 h-6 mr-2">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Z" clipRule="evenodd" />
            </svg>
            Today's Quests
          </h2>
          <Quests quests={displayQuests} />
          <div className="mt-5 text-center">
            <a href="/dashboard/quests" className="inline-flex items-center text-sm text-white font-bold bg-gradient-to-r from-[#58CC02] to-[#46A302] px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5">
              View all quests
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1" aria-hidden="true">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
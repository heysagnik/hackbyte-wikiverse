"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

// Duolingo-inspired color palette
const COLORS = {
  primary: { from: "#58CC02", to: "#46A302" },      // Bright green
  secondary: { from: "#1CB0F6", to: "#0A91D3" },    // Playful blue
  accent: { from: "#FF9600", to: "#E08600" },       // Vibrant orange
  purple: { from: "#8549BA", to: "#7039A8" },       // Duolingo purple
  yellow: { from: "#FFC800", to: "#FFAF00" },       // Sunshine yellow
  red: { from: "#FF4B4B", to: "#E63F3F" }           // Bright red
};

type Activity = { title: string; time: string; type: "edit" | "achievement" | "comment"; };
type Article = { title: string; issues: string[]; priority: "high" | "medium" | "low"; };
type Quest = { title: string; progress: number; total: number; };
type CommunityUpdate = { username: string; userInitial: string; action: string; time: string; };
type UserStats = {
  edits: number; editsThisWeek: number; xp: number; level: number; levelProgress: number;
  activeQuests: number; completedQuests: number; articlesWatched: number; articlesUpdated: number;
};

const RecentActivity = ({ activities }: { activities: Activity[] }) => (
  <div className="space-y-3">
    {activities.length > 0 ? activities.map((activity, index) => (
      <div key={index} className="flex py-3 border-b border-[#E5E7EB] last:border-0 transition-all duration-200 hover:bg-[#F1FFEB] -mx-4 px-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-white flex-shrink-0 shadow-sm ${
          activity.type === "edit" ? "bg-gradient-to-br from-[#58CC02] to-[#46A302]" : 
          activity.type === "achievement" ? "bg-gradient-to-br from-[#FF9600] to-[#E08600]" : 
          "bg-gradient-to-br from-[#1CB0F6] to-[#0A91D3]"
        }`}>
          {activity.type === "edit" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
          )}
          {activity.type === "achievement" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          )}
          {activity.type === "comment" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-[#4B5563]">{activity.title}</p>
          <p className="text-xs text-[#6B7280]">{activity.time}</p>
        </div>
      </div>
    )) : (
      <div className="text-center py-6 text-[#6B7280] bg-[#F1FFEB] rounded-lg border-2 border-dashed border-[#A6E772]">
        <p className="font-bold">No activity yet.</p>
        <p>Complete lessons to see your progress!</p>
      </div>
    )}
  </div>
);

const DailyStreak = ({ days = 5, maxDays = 7 }) => (
  <div className="bg-white border-2 border-[#E5E7EB] rounded-xl p-4 shadow-sm hover:border-[#FF9600] transition-all duration-200">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-extrabold text-[#1F2937] text-lg">Daily Streak</h3>
      <span className="bg-gradient-to-br from-[#FF9600] to-[#E08600] text-white px-3 py-1 rounded-full text-sm font-bold">
        {days} days
      </span>
    </div>
    <div className="flex justify-between items-center space-x-1">
      {Array.from({ length: maxDays }).map((_, i) => (
        <div key={i} className={`flex-1 h-2.5 rounded-full ${i < days ? 'bg-gradient-to-r from-[#FF9600] to-[#E08600]' : 'bg-[#E5E7EB]'}`}></div>
      ))}
    </div>
    <p className="text-xs text-[#6B7280] mt-3 text-center">
      Keep your streak going! {days < maxDays ? `${maxDays - days} more days to perfect week.` : "Perfect week achieved! 🎉"}
    </p>
  </div>
);

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

const ArticlePreview = ({ articles }: { articles: Article[] }) => (
  <div className="space-y-3">
    {articles.length > 0 ? articles.map((article, index) => (
      <div key={index} className="py-3 border-b border-[#E5E7EB] last:border-0 transition-all duration-200 hover:bg-[#F1FFEB] -mx-4 px-4 rounded-lg">
        <div className="flex justify-between items-start">
          <a href="#" className="text-[#58CC02] hover:underline font-bold">
            {article.title}
          </a>
          <span 
            className={`text-xs px-3 py-1.5 rounded-full font-bold ${
              article.priority === "high" 
                ? "bg-gradient-to-br from-[#FF4B4B] to-[#E63F3F] text-white" 
                : "bg-gradient-to-br from-[#FF9600] to-[#E08600] text-white"
            }`}
          >
            {article.priority === "high" ? "Hard" : "Medium"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {article.issues.map((issue, i) => (
            <span key={i} className="text-xs bg-[#F1FFEB] px-2.5 py-1 rounded-full text-[#58CC02] font-bold border border-[#A6E772]">
              {issue}
            </span>
          ))}
        </div>
      </div>
    )) : (
      <div className="text-center py-6 text-[#6B7280] bg-[#F1FFEB] rounded-lg border-2 border-dashed border-[#A6E772]">
        <p className="font-bold">No lessons available.</p>
        <p>Check back soon for new content!</p>
      </div>
    )}
  </div>
);



const fallbackActivities: Activity[] = [
  { title: "Edited Climate Change article", time: "2 hours ago", type: "edit" },
  { title: "Earned Editor Badge", time: "1 day ago", type: "achievement" },
  { title: "Commented on Solar Energy", time: "3 days ago", type: "comment" }
];

const fallbackArticles = [
  { title: "Renewable Energy", issues: ["Missing citations", "Needs update"], priority: "high" },
  { title: "Electric Vehicles", issues: ["Expand section"], priority: "medium" }
];

const fallbackQuests = [
  { title: "Add 3 citations to articles", progress: 1, total: 3 },
  { title: "Complete your first edit", progress: 0, total: 1 }
];


export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState<UserStats>({
    edits: 0, editsThisWeek: 0, xp: 0, level: 1, levelProgress: 0,
    activeQuests: 0, completedQuests: 0, articlesWatched: 0, articlesUpdated: 0
  });
  
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [articlesNeedingAttention, setArticlesNeedingAttention] = useState<Article[]>([]);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [communityUpdates, setCommunityUpdates] = useState<CommunityUpdate[]>([]);
  const [username, setUsername] = useState("");

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
      if (status !== "authenticated" || !session?.user) {
        return;
      }
      
      setLoading(true);
      setError("");

      try {
        setUsername((session.user as any).name || (session.user as any).username || "User");
        
        try {
          const profileResponse = await fetch('/api/users/profile');
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            
            if (!profileData.user?.hasCompletedOnboarding) {
              // Redirect to onboarding if needed
            }
          }
        } catch (profileError) {
          // Handle profile errors silently
        }
        
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
        
        const [activitiesData, articlesData, questsData, updatesData] = await Promise.all([
          fetchData('/api/users/activities'),
          fetchData('/api/articles/needs-attention'),
          fetchData('/api/quests/active'),
          fetchData('/api/community/updates')
        ]);
        
        setUserActivities(activitiesData.activities || []);
        setArticlesNeedingAttention(articlesData.articles || []);
        setActiveQuests(questsData.quests || []);
        setCommunityUpdates(updatesData.updates || []);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status, fetchData]);
  
  const displayData = useMemo(() => ({
    activities: userActivities.length > 0 ? userActivities : fallbackActivities,
    articles: articlesNeedingAttention.length > 0 ? articlesNeedingAttention : fallbackArticles,
    quests: activeQuests.length > 0 ? activeQuests : fallbackQuests,
   
  }), [userActivities, articlesNeedingAttention, activeQuests, communityUpdates]);

  if (loading && status === "authenticated") {
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
              <span className="font-bold">{userStats.editsThisWeek} day streak</span>
            </div>
            <div className="bg-[#58CC02] text-white px-3 py-1 rounded-full text-sm font-bold">
              {userStats.xp} XP
            </div>
          </div>
        </div>
      </header>

      {/* Redesigned Bento Grid with Duolingo colors */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Level Progress - Spans top row full width */}
        <div className="md:col-span-12 bg-gradient-to-r from-[#F1FFEB] to-[#E9FFD9] rounded-xl border-2 border-[#A6E772] p-4 flex flex-wrap md:flex-nowrap items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-[#58CC02] to-[#46A302] rounded-full flex items-center justify-center text-white mr-4 shadow-md">
              <span className="font-extrabold text-2xl">{userStats.level}</span>
            </div>
            <div className="flex-grow md:w-64">
              <h2 className="text-xl font-extrabold text-[#1F2937]">Level {userStats.level} Wiki Editor</h2>
              <div className="w-full bg-white rounded-full h-2.5 mt-2">
                <div 
                  className="bg-gradient-to-r from-[#58CC02] to-[#46A302] h-2.5 rounded-full" 
                  style={{ width: `${userStats.levelProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">{Math.floor(100 / userStats.levelProgress * userStats.xp - userStats.xp)} XP needed for Level {userStats.level + 1}</p>
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
              <p className="font-extrabold text-xl text-[#FF9600]">{userStats.editsThisWeek} days</p>
            </div>
          </div>
        </div>

        {/* Today's Quests - Left side, spans 6 columns */}
        <div className="md:col-span-6 bg-white border-2 border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#58CC02] transition-all duration-300">
          <h2 className="font-extrabold text-[#1F2937] text-xl mb-5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#58CC02" className="w-6 h-6 mr-2">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Z" clipRule="evenodd" />
            </svg>
            Today's Quests
          </h2>
          <Quests quests={displayData.quests} />
          <div className="mt-5 text-center">
            <a href="#" className="inline-flex items-center text-sm text-white font-bold bg-gradient-to-r from-[#58CC02] to-[#46A302] px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md">
              View all quests
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1" aria-hidden="true">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Recent activity - Right side, spans 6 columns */}
        <div className="md:col-span-6 bg-white border-2 border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:border-[#1CB0F6] transition-all duration-300">
          <h2 className="font-extrabold text-[#1F2937] text-xl mb-5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1CB0F6" className="w-6 h-6 mr-2">
              <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Z" />
            </svg>
            Your Recent Activity
          </h2>
          <RecentActivity activities={displayData.activities} />
          <div className="mt-5 text-center">
            <a href="#" className="inline-flex items-center text-sm text-white font-bold bg-gradient-to-r from-[#1CB0F6] to-[#0A91D3] px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md">
              View all activity
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
"use client";
import React from "react";

const StatCard = ({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description?: string }) => (
  <div className="bg-white border border-[#c8ccd1] rounded-md p-5 flex items-center transition-all duration-200 hover:shadow-md hover:border-[#a2a9b1]">
    <div className="w-12 h-12 bg-[#eaf3ff] rounded-full flex items-center justify-center text-[#3366cc] mr-4 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-[#54595d]">{title}</h3>
      <p className="text-2xl font-serif">{value}</p>
      {description && <p className="text-xs text-[#72777d] mt-1">{description}</p>}
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="space-y-3">
    {[
      {
        title: "Article edited: Climate Change",
        time: "2 hours ago",
        type: "edit",
      },
      {
        title: "New achievement: 5 edits milestone",
        time: "Yesterday",
        type: "achievement",
      },
      {
        title: "Comment on Talk:Renewable Energy",
        time: "3 days ago",
        type: "comment",
      },
    ].map((activity, index) => (
      <div key={index} className="flex py-3 border-b border-[#eaecf0] last:border-0 transition-all duration-200 hover:bg-[#f8f9fa] -mx-4 px-4">
        <div className="w-8 h-8 bg-[#f0f8ff] rounded-full flex items-center justify-center mr-3 text-[#3366cc] flex-shrink-0">
          {activity.type === "edit" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
          )}
          {activity.type === "achievement" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          )}
          {activity.type === "comment" && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-[#202122]">{activity.title}</p>
          <p className="text-xs text-[#72777d]">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
);

const ArticlePreview = () => (
  <div className="space-y-3">
    <div className="font-serif text-[#162860] text-xl border-b border-[#eaecf0] pb-2">
      Articles needing attention
    </div>
    {[
      {
        title: "Renewable Energy",
        issues: ["Citation needed", "Requires update"],
        priority: "high",
      },
      {
        title: "Artificial Intelligence",
        issues: ["Needs expansion"],
        priority: "medium",
      },
      {
        title: "Global Warming",
        issues: ["POV concerns", "Outdated statistics"],
        priority: "high",
      },
    ].map((article, index) => (
      <div key={index} className="py-3 border-b border-[#eaecf0] last:border-0 transition-all duration-200 hover:bg-[#f8f9fa] -mx-4 px-4">
        <div className="flex justify-between items-start">
          <a href="#" className="text-[#3366cc] hover:underline font-medium">
            {article.title}
          </a>
          <span 
            className={`text-xs px-2.5 py-1 rounded-full ${
              article.priority === "high" 
                ? "bg-[#fee7e6] text-[#d33]" 
                : "bg-[#fef6e7] text-[#fc3]"
            }`}
          >
            {article.priority === "high" ? "High" : "Medium"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {article.issues.map((issue, i) => (
            <span key={i} className="text-xs bg-[#eaecf0] px-2.5 py-1 rounded-md text-[#54595d]">
              {issue}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function Dashboard() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl md:text-3xl text-[#202122] font-serif mb-3">Dashboard</h1>
        <p className="text-[#54595d] md:text-lg">
          Welcome back, WikiGuardian. Here's what's happening in the Wikiverse today.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard 
          title="Your edits" 
          value="27" 
          description="+3 this week"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
          } 
        />
        <StatCard 
          title="Experience" 
          value="542 XP" 
          description="Level 3 (58% to Level 4)"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 16.09l.15.232a.75.75 0 0 0 1.138.21 9.746 9.746 0 0 0 2.354-3.998A9.75 9.75 0 0 0 19.5 7.365a.75.75 0 0 0-.728-.729 9.753 9.753 0 0 0-3.583.328 9.742 9.742 0 0 0-2.226-4.678Z" clipRule="evenodd" />
            </svg>
          } 
        />
        <StatCard 
          title="Quests" 
          value="2 active" 
          description="5 completed"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>
          } 
        />
        <StatCard 
          title="Articles watched" 
          value="12" 
          description="3 updated recently"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
            </svg>
          } 
        />
      </div>

      {/* Main content grid - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's quests - moved to the left side */}
        <div className="bg-white border border-[#c8ccd1] rounded-md p-5 md:col-span-2 lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="font-serif text-[#162860] text-xl border-b border-[#eaecf0] pb-3 mb-5">
            Today's quests
          </h2>
          <div className="space-y-5">
            <div className="border-l-4 border-[#3366cc] pl-4 py-3 bg-[#f8f9fa] rounded-r-md">
              <h3 className="font-medium text-[#202122]">Fix 3 citation issues</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="w-full max-w-xs bg-[#eaecf0] rounded-full h-2.5">
                  <div className="bg-[#3366cc] h-2.5 rounded-full transition-all duration-1000" style={{ width: "33%" }}></div>
                </div>
                <span className="text-xs text-[#54595d] ml-3 font-medium">1/3</span>
              </div>
            </div>
            <div className="border-l-4 border-[#36c] pl-4 py-3 bg-[#f8f9fa] rounded-r-md">
              <h3 className="font-medium text-[#202122]">Add 2 references to "Artificial Intelligence"</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="w-full max-w-xs bg-[#eaecf0] rounded-full h-2.5">
                  <div className="bg-[#3366cc] h-2.5 rounded-full transition-all duration-1000" style={{ width: "0%" }}></div>
                </div>
                <span className="text-xs text-[#54595d] ml-3 font-medium">0/2</span>
              </div>
            </div>
            <div className="border-l-4 border-[#36c] pl-4 py-3 bg-[#f8f9fa] rounded-r-md">
              <h3 className="font-medium text-[#202122]">Review edits on "Democracy"</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="w-full max-w-xs bg-[#eaecf0] rounded-full h-2.5">
                  <div className="bg-[#3366cc] h-2.5 rounded-full transition-all duration-1000" style={{ width: "50%" }}></div>
                </div>
                <span className="text-xs text-[#54595d] ml-3 font-medium">1/2</span>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <a href="#" className="inline-flex items-center text-sm text-[#3366cc] hover:underline font-medium bg-[#f8f9fa] px-4 py-2 rounded-md transition-colors hover:bg-[#eaf3ff]">
              View all quests
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Recent activity - moved to the right side */}
        <div className="bg-white border border-[#c8ccd1] rounded-md p-5 row-span-2 lg:row-span-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="font-serif text-[#162860] text-xl border-b border-[#eaecf0] pb-3 mb-5">
            Your recent activity
          </h2>
          <RecentActivity />
          <div className="mt-5 text-center">
            <a href="#" className="inline-flex items-center text-sm text-[#3366cc] hover:underline font-medium bg-[#f8f9fa] px-4 py-2 rounded-md transition-colors hover:bg-[#eaf3ff]">
              View all activity
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Article Previews */}
        <div className="bg-white border border-[#c8ccd1] rounded-md p-5 md:col-span-1 lg:col-span-1 shadow-sm hover:shadow-md transition-shadow duration-300">
          <ArticlePreview />
          <div className="mt-5 text-center">
            <a href="#" className="inline-flex items-center text-sm text-[#3366cc] hover:underline font-medium bg-[#f8f9fa] px-4 py-2 rounded-md transition-colors hover:bg-[#eaf3ff]">
              View workboard
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Community activity */}
        <div className="bg-white border border-[#c8ccd1] rounded-md p-5 md:col-span-1 lg:col-span-1 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="font-serif text-[#162860] text-xl border-b border-[#eaecf0] pb-3 mb-5">
            Community updates
          </h2>
          <div className="space-y-4">
            <div className="flex items-start bg-[#f8f9fa] p-3 rounded-md transition-all duration-200 hover:bg-[#eaf3ff]">
              <div className="w-10 h-10 bg-[#eaf3ff] rounded-full flex items-center justify-center text-[#3366cc] mr-3 flex-shrink-0 border-2 border-[#dae6fc]">
                <span className="font-medium">A</span>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium text-[#202122]">ArticleWizard</span> completed a featured article on Climate Change
                </p>
                <p className="text-xs text-[#72777d] mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start bg-[#f8f9fa] p-3 rounded-md transition-all duration-200 hover:bg-[#eaf3ff]">
              <div className="w-10 h-10 bg-[#eaf3ff] rounded-full flex items-center justify-center text-[#3366cc] mr-3 flex-shrink-0 border-2 border-[#dae6fc]">
                <span className="font-medium">R</span>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium text-[#202122]">ReferenceQueen</span> fixed 15 citation issues on Science articles
                </p>
                <p className="text-xs text-[#72777d] mt-1">3 hours ago</p>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <a href="#" className="inline-flex items-center text-sm text-[#3366cc] hover:underline font-medium bg-[#f8f9fa] px-4 py-2 rounded-md transition-colors hover:bg-[#eaf3ff]">
              View community feed
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
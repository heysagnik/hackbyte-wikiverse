"use client";
import React, { useState } from "react";
import Link from "next/link";

// Duolingo-inspired color palette
const COLORS = {
  primary: { from: "#58CC02", to: "#46A302" },      // Bright green
  secondary: { from: "#1CB0F6", to: "#0A91D3" },    // Playful blue
  accent: { from: "#FF9600", to: "#E08600" },       // Vibrant orange
  purple: { from: "#8549BA", to: "#7039A8" },       // Duolingo purple
  yellow: { from: "#FFC800", to: "#FFAF00" },       // Sunshine yellow
  red: { from: "#FF4B4B", to: "#E63F3F" }           // Bright red
};

const CategoryBadge = ({ name, count }: { name: string; count: number }) => (
  <div className="flex items-center bg-white border-2 border-[#E5E7EB] rounded-xl px-4 py-2 hover:border-[#58CC02] transition-all duration-200 cursor-pointer shadow-sm">
    <span className="text-sm font-bold text-[#1F2937]">{name}</span>
    <span className="ml-2 bg-gradient-to-br from-[#58CC02] to-[#46A302] text-white text-xs px-2 py-0.5 rounded-full font-bold">{count}</span>
  </div>
);

const UserAvatar = ({ name, isExpert, size = "sm" }: { name: string; isExpert?: boolean; size?: "sm" | "md" | "lg" }) => {
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  
  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#1CB0F6] to-[#0A91D3] rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm`}>
        {initials}
      </div>
      {isExpert && (
        <div className="absolute -right-1 -bottom-1 bg-gradient-to-br from-[#FFC800] to-[#FFAF00] rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2 h-2">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

const DiscussionCard = ({ 
  title, 
  excerpt, 
  category, 
  author, 
  isAuthorExpert, 
  replies, 
  lastActivity 
}: { 
  title: string;
  excerpt: string;
  category: string;
  author: string;
  isAuthorExpert: boolean;
  replies: number;
  lastActivity: string;
}) => (
  <div className="bg-white border-2 border-[#E5E7EB] rounded-xl p-5 hover:border-[#1CB0F6] transition-all duration-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <Link href="#" className="text-[#1F2937] hover:text-[#1CB0F6] transition-colors text-lg font-bold">
          {title}
        </Link>
        <div className="mt-1">
          <span className="inline-block text-xs bg-[#F1FFEB] px-2.5 py-1 rounded-lg text-[#58CC02] font-bold border border-[#A6E772]">
            {category}
          </span>
        </div>
      </div>
      <div className="flex -space-x-2">
        <UserAvatar name={author} isExpert={isAuthorExpert} />
      </div>
    </div>
    <p className="text-sm text-[#4B5563] mt-3 line-clamp-2">{excerpt}</p>
    <div className="mt-4 flex justify-between items-center pt-3 border-t border-[#E5E7EB]">
      <div className="flex items-center text-[#6B7280] text-xs">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1CB0F6" className="w-4 h-4 mr-1">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
          </svg>
          <span className="font-bold">{replies} replies</span>
        </div>
        <span className="mx-2">•</span>
        <span>Last active {lastActivity}</span>
      </div>
      <div>
        <button className="text-xs text-white font-bold bg-gradient-to-r from-[#1CB0F6] to-[#0A91D3] hover:opacity-90 px-3 py-1.5 rounded-lg shadow-sm transition-all">
          Join discussion
        </button>
      </div>
    </div>
  </div>
);

const AskQuestionForm = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-[#1CB0F6] shadow-lg">
      <div className="p-5 border-b border-[#E5E7EB]">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-[#1F2937]">Ask a question</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1F2937] bg-[#F3F4F6] rounded-full w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-5">
          <label htmlFor="title" className="block text-sm font-bold text-[#4B5563] mb-1">Question title</label>
          <input 
            type="text" 
            id="title" 
            className="w-full px-3 py-2 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] focus:border-[#1CB0F6]"
            placeholder="Be specific and imagine you're asking another person"
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="category" className="block text-sm font-bold text-[#4B5563] mb-1">Category</label>
          <select 
            id="category" 
            className="w-full px-3 py-2 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] focus:border-[#1CB0F6]"
          >
            <option value="">Select a category</option>
            <option value="editing">Editing Guidelines</option>
            <option value="sources">Finding Reliable Sources</option>
            <option value="technical">Technical Help</option>
            <option value="policy">Policy Questions</option>
            <option value="general">General Discussion</option>
          </select>
        </div>
        
        <div className="mb-5">
          <label htmlFor="details" className="block text-sm font-bold text-[#4B5563] mb-1">Question details</label>
          <textarea 
            id="details" 
            rows={6}
            className="w-full px-3 py-2 border-2 border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1CB0F6] focus:border-[#1CB0F6]"
            placeholder="Include all the information someone would need to answer your question"
          ></textarea>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-[#1F2937] bg-white border-2 border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] font-bold"
          >
            Cancel
          </button>
          <button className="px-4 py-2.5 text-white font-bold bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-xl hover:opacity-90 shadow-sm">
            Post Question (+15 XP)
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ExpertCard = ({ name, specialty, contributions, joinDate }: { name: string; specialty: string; contributions: number; joinDate: string }) => (
  <div className="bg-white border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#FFC800] transition-all duration-200 shadow-sm flex flex-col items-center text-center">
    <UserAvatar name={name} isExpert={true} size="lg" />
    <h3 className="mt-3 font-bold text-[#1F2937]">{name}</h3>
    <div className="px-3 py-1 bg-gradient-to-br from-[#FFC800] to-[#FFAF00] rounded-full text-white text-xs font-bold mt-1 shadow-sm">
      {specialty}
    </div>
    <div className="mt-3 w-full">
      <div className="text-xs text-[#6B7280] flex justify-between">
        <span>Contributions</span>
        <span className="font-bold text-[#1F2937]">{contributions}</span>
      </div>
      <div className="w-full bg-[#F3F4F6] rounded-full h-2 mt-1">
        <div className="bg-gradient-to-r from-[#FFC800] to-[#FFAF00] h-2 rounded-full" style={{ width: `${Math.min(contributions/30, 100)}%` }}></div>
      </div>
      <div className="text-xs text-[#6B7280] flex justify-between mt-2">
        <span>Member since</span>
        <span className="font-bold text-[#1F2937]">{joinDate}</span>
      </div>
    </div>
    <button className="mt-4 w-full text-white font-bold bg-gradient-to-r from-[#8549BA] to-[#7039A8] py-2 rounded-lg hover:opacity-90 transition-colors shadow-sm">
      Connect (+5 XP)
    </button>
  </div>
);

export default function Community() {
  const [showAskQuestionForm, setShowAskQuestionForm] = useState(false);
  const [userXP, setUserXP] = useState(420); // Example XP
  const [userLevel, setUserLevel] = useState(8); // Example level
  
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-[#FAFDF7]">
    

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl text-[#1F2937] font-extrabold mb-2">Community Forum</h1>
        <p className="text-[#6B7280]">
          Ask questions, help others, and earn XP by contributing to the community.
        </p>
      </header>

      {/* Top actions bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full pl-10 pr-4 py-2.5 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#58CC02] focus:border-[#58CC02]"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div>
          <button 
            onClick={() => setShowAskQuestionForm(true)}
            className="px-5 py-2.5 text-white font-bold bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-xl hover:opacity-90 transition-colors shadow-sm flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Ask a Question</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-[#1F2937] mb-4">Browse Categories</h2>
        <div className="flex flex-wrap gap-3">
          <CategoryBadge name="All Topics" count={253} />
          <CategoryBadge name="Editing Guidelines" count={78} />
          <CategoryBadge name="Finding Sources" count={45} />
          <CategoryBadge name="Technical Help" count={62} />
          <CategoryBadge name="Policy Questions" count={39} />
          <CategoryBadge name="General Discussion" count={29} />
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="mb-8 bg-white border-2 border-[#A6E772] rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#1F2937] mb-4 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-[#58CC02] to-[#46A302] rounded-lg flex items-center justify-center text-white mr-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          Daily Challenges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F1FFEB] border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#58CC02] transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#1F2937]">Answer a Question</h3>
              <span className="text-xs px-2 py-1 bg-[#F1FFEB] text-[#58CC02] font-bold rounded-full border border-[#A6E772]">+20 XP</span>
            </div>
            <p className="text-sm text-[#4B5563] mb-3">Help another editor by answering one of their questions</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-[#6B7280]">0/1 completed</span>
              <button className="text-xs text-white font-bold bg-gradient-to-r from-[#58CC02] to-[#46A302] py-1.5 px-3 rounded-lg shadow-sm">
                Find Questions
              </button>
            </div>
          </div>
          
          <div className="bg-[#F1FFEB] border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#58CC02] transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#1F2937]">Share Knowledge</h3>
              <span className="text-xs px-2 py-1 bg-[#F1FFEB] text-[#58CC02] font-bold rounded-full border border-[#A6E772]">+15 XP</span>
            </div>
            <p className="text-sm text-[#4B5563] mb-3">Post a helpful tip or resource in any discussion</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-[#6B7280]">0/1 completed</span>
              <button className="text-xs text-white font-bold bg-gradient-to-r from-[#58CC02] to-[#46A302] py-1.5 px-3 rounded-lg shadow-sm">
                Start Sharing
              </button>
            </div>
          </div>
          
          <div className="bg-[#F1FFEB] border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#58CC02] transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#1F2937]">Vote on Replies</h3>
              <span className="text-xs px-2 py-1 bg-[#F1FFEB] text-[#58CC02] font-bold rounded-full border border-[#A6E772]">+5 XP</span>
            </div>
            <p className="text-sm text-[#4B5563] mb-3">Vote on 3 helpful replies in any discussion</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-[#6B7280]">1/3 completed</span>
              <button className="text-xs text-white font-bold bg-gradient-to-r from-[#58CC02] to-[#46A302] py-1.5 px-3 rounded-lg shadow-sm">
                Find Discussions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussion column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#1F2937] mb-4 flex justify-between items-center">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF9600" className="w-6 h-6 mr-2">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                Featured Discussions
              </span>
              <Link href="#" className="text-sm text-[#1CB0F6] hover:underline font-bold">View all</Link>
            </h2>
            <div className="space-y-4">
              <DiscussionCard 
                title="How to correctly cite academic journals?" 
                excerpt="I'm working on an article about climate science and need help with the proper citation format for peer-reviewed journals. I've tried following the guidelines but..." 
                category="Finding Sources"
                author="NewEditor23"
                isAuthorExpert={false}
                replies={8}
                lastActivity="2 hours ago"
              />
              <DiscussionCard 
                title="Neutral point of view in controversial topics" 
                excerpt="I'm having difficulty maintaining NPOV when writing about politically charged subjects. What strategies do experienced editors use to ensure balanced coverage?" 
                category="Editing Guidelines"
                author="HistoryBuff"
                isAuthorExpert={true}
                replies={12}
                lastActivity="Yesterday"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-extrabold text-[#1F2937] mb-4 flex justify-between items-center">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1CB0F6" className="w-6 h-6 mr-2">
                  <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
                </svg>
                Recent Questions
              </span>
              <Link href="#" className="text-sm text-[#1CB0F6] hover:underline font-bold">View all</Link>
            </h2>
            <div className="space-y-4">
              <DiscussionCard 
                title="How to handle conflicting sources?" 
                excerpt="I've found multiple reliable sources that contradict each other on key facts. What's the proper way to present this information in an article while maintaining..." 
                category="Finding Sources"
                author="ScienceWriter"
                isAuthorExpert={false}
                replies={3}
                lastActivity="4 hours ago"
              />
              <DiscussionCard 
                title="Technical issues with image uploads" 
                excerpt="I'm trying to upload SVG diagrams but keep getting error messages. I've checked the file format and size requirements but still can't get it to work. Has anyone..." 
                category="Technical Help"
                author="GraphicsDesigner"
                isAuthorExpert={false}
                replies={5}
                lastActivity="1 day ago"
              />
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connect with experts */}
          <div className="bg-white border-2 border-[#E5E7EB] rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#1F2937] mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFC800" className="w-6 h-6 mr-2">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm10.826 9.471a1.5 1.5 0 01-2.119 0l-3.75-3.75a1.5 1.5 0 111.06-2.56L15.75 9l2.23-2.23a1.5 1.5 0 112.12 2.12l-3.75 3.75z" clipRule="evenodd" />
              </svg>
              Expert Helpers
            </h2>
            <div className="space-y-4">
              <ExpertCard 
                name="Dr. Sarah Chen" 
                specialty="Science Editor"
                contributions={1472}
                joinDate="Mar 2018"
              />
              <ExpertCard 
                name="Robert Wilson" 
                specialty="History Expert"
                contributions={2845}
                joinDate="Nov 2015"
              />
            </div>
            <div className="mt-4 text-center">
              <Link href="#" className="inline-flex items-center text-sm text-white font-bold bg-gradient-to-r from-[#8549BA] to-[#7039A8] px-4 py-2 rounded-xl shadow-sm hover:opacity-90 transition-all">
                View all experts
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
       
        </div>
      </div>

      {/* Question form modal */}
      {showAskQuestionForm && <AskQuestionForm onClose={() => setShowAskQuestionForm(false)} />}
    </div>
  );
}
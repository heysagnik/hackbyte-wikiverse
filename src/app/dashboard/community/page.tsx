"use client";
import React, { useState } from "react";
import Link from "next/link";

const CategoryBadge = ({ name, count }: { name: string; count: number }) => (
    <div className="flex items-center border border-[#c8ccd1] rounded-full px-4 py-1.5 hover:bg-[#f8f9fa] transition-colors cursor-pointer">
        <span className="text-sm font-medium text-[#3366cc]">{name}</span>
        <span className="ml-2 text-xs bg-[#eaecf0] px-2 py-0.5 rounded-full text-[#54595d]">{count}</span>
    </div>
);

const UserAvatar = ({ name, isExpert, size = "sm" }: { name: string; isExpert?: boolean; size?: "sm" | "md" | "lg" }) => {
    const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
    };

    return (
        <div className="relative">
            <div className={`${sizeClasses[size]} bg-[#eaf3ff] rounded-full flex items-center justify-center text-[#3366cc] font-medium border-2 border-[#dae6fc]`}>
                {initials}
            </div>
            {isExpert && (
                <div className="absolute -right-1 -bottom-1 bg-[#36c] rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Z" clipRule="evenodd" />
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
    lastActivity,
}: {
    title: string;
    excerpt: string;
    category: string;
    author: string;
    isAuthorExpert: boolean;
    replies: number;
    lastActivity: string;
}) => (
    <div className="border border-[#c8ccd1] rounded-md p-5 hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start">
            <div>
                <Link href="#" className="text-[#3366cc] hover:underline text-lg font-serif">
                    {title}
                </Link>
                <div className="mt-1">
                    <span className="inline-block text-xs bg-[#eaecf0] px-2.5 py-1 rounded-md text-[#54595d] font-medium">
                        {category}
                    </span>
                </div>
            </div>
            <div className="flex -space-x-2">
                <UserAvatar name={author} isExpert={isAuthorExpert} />
            </div>
        </div>
        <p className="text-sm text-[#54595d] mt-3 line-clamp-2">{excerpt}</p>
        <div className="mt-4 flex justify-between items-center pt-3 border-t border-[#eaecf0]">
            <div className="flex items-center text-[#72777d] text-xs">
                <span className="font-medium">{replies} replies</span>
                <span className="mx-2">•</span>
                <span>Last activity {lastActivity}</span>
            </div>
            <div>
                <Link href="#" className="text-xs text-[#3366cc] hover:underline">
                    View discussion
                </Link>
            </div>
        </div>
    </div>
);

const AskQuestionForm = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-[#eaecf0]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-serif text-[#202122]">Ask a question</h2>
                    <button onClick={onClose} className="text-[#54595d] hover:text-[#202122]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="p-5">
                <div className="mb-5">
                    <label htmlFor="title" className="block text-sm font-medium text-[#54595d] mb-1">
                        Question title
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="w-full px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                        placeholder="Be specific and imagine you're asking another person"
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="category" className="block text-sm font-medium text-[#54595d] mb-1">
                        Category
                    </label>
                    <select
                        id="category"
                        className="w-full px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
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
                    <label htmlFor="details" className="block text-sm font-medium text-[#54595d] mb-1">
                        Question details
                    </label>
                    <textarea
                        id="details"
                        rows={6}
                        className="w-full px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                        placeholder="Include all the information someone would need to answer your question"
                    ></textarea>
                </div>
                <div className="flex flex-col md:flex-row gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-[#3366cc] bg-white border border-[#c8ccd1] rounded-md hover:bg-[#f8f9fa]">
                        Cancel
                    </button>
                    <button className="px-4 py-2 text-white bg-[#3366cc] rounded-md hover:bg-[#2a4c8f]">
                        Post Question
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const ExpertCard = ({
    name,
    specialty,
    contributions,
    joinDate,
}: {
    name: string;
    specialty: string;
    contributions: number;
    joinDate: string;
}) => (
    <div className="border border-[#c8ccd1] rounded-md p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center">
        <UserAvatar name={name} isExpert={true} size="lg" />
        <h3 className="mt-3 font-medium text-[#202122]">{name}</h3>
        <p className="text-sm text-[#54595d] mt-1">{specialty}</p>
        <div className="mt-3 w-full">
            <div className="text-xs text-[#72777d] flex justify-between">
                <span>Contributions</span>
                <span className="font-medium text-[#202122]">{contributions}</span>
            </div>
            <div className="text-xs text-[#72777d] flex justify-between mt-1">
                <span>Member since</span>
                <span className="font-medium text-[#202122]">{joinDate}</span>
            </div>
        </div>
        <button className="mt-4 w-full text-sm text-[#3366cc] hover:underline hover:bg-[#eaf3ff] transition-colors py-1.5 rounded-md">
            View profile
        </button>
    </div>
);

export default function Community() {
    const [showAskQuestionForm, setShowAskQuestionForm] = useState(false);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-2xl md:text-3xl text-[#202122] font-serif mb-3">WikiCommunity Forum</h1>
                <p className="text-[#54595d] md:text-lg">
                    Connect with editors around the world, ask questions, and share knowledge.
                </p>
            </header>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        className="w-full pl-10 pr-4 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#72777d]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <button onClick={() => setShowAskQuestionForm(true)} className="px-4 py-2 text-white bg-[#3366cc] rounded-md hover:bg-[#2a4c8f]">
                    Ask a question
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DiscussionCard
                    title="How do I cite multiple sources in my article?"
                    excerpt="I'm struggling with how to properly format citations for multiple sources within the same paragraph..."
                    category="General Discussion"
                    author="Jane Doe"
                    isAuthorExpert={false}
                    replies={12}
                    lastActivity="2 hours ago"
                />
                <DiscussionCard
                    title="What are the best practices for editing ambiguous references?"
                    excerpt="I often come across references that are unclear. How do other editors handle this situation?"
                    category="Editing Guidelines"
                    author="John Smith"
                    isAuthorExpert={true}
                    replies={5}
                    lastActivity="1 day ago"
                />
                <DiscussionCard
                    title="Can someone help me with technical issues on the platform?"
                    excerpt="I've encountered a bug when trying to submit my changes. Any advice on how to resolve this?"
                    category="Technical Help"
                    author="Alice Johnson"
                    isAuthorExpert={false}
                    replies={8}
                    lastActivity="3 days ago"
                />
            </div>
            <section className="mt-12">
                <h2 className="text-xl md:text-2xl font-serif text-[#202122] mb-6">Meet our Experts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ExpertCard name="Dr. Emily Carter" specialty="Historical Research" contributions={150} joinDate="2018" />
                    <ExpertCard name="Mr. Robert Langdon" specialty="Symbolic Analysis" contributions={200} joinDate="2016" />
                    <ExpertCard name="Ms. Sarah Connor" specialty="Technology and Futurism" contributions={180} joinDate="2019" />
                    <ExpertCard name="Mr. John Carter" specialty="Archaeology" contributions={120} joinDate="2020" />
                </div>
            </section>
            {showAskQuestionForm && <AskQuestionForm onClose={() => setShowAskQuestionForm(false)} />}
        </div>
    );
}
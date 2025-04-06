"use client";
import React from "react";
import Link from "next/link";
import { Award, Gift, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const featuredRewards = [
  {
    id: 1,
    title: "Exclusive Badge",
    description: "Unlock an exclusive badge to showcase your achievements.",
    xpCost: 100,
    icon: <Award className="w-10 h-10 text-yellow-500" />,
  },
  {
    id: 2,
    title: "Theme Pack",
    description: "Personalize your interface with a unique dashboard theme.",
    xpCost: 250,
    icon: <Gift className="w-10 h-10 text-purple-500" />,
  },
];

const allRewards = [
  {
    id: 3,
    title: "Profile Sticker",
    description: "Add a fun sticker to your profile.",
    xpCost: 50,
    icon: <Star className="w-10 h-10 text-blue-500" />,
  },
  {
    id: 4,
    title: "Custom Background",
    description: "Customize your dashboard background with exclusive art.",
    xpCost: 300,
    icon: <Gift className="w-10 h-10 text-pink-500" />,
  },
  {
    id: 5,
    title: "Limited Icon Set",
    description: "Stand out with a limited edition icon set.",
    xpCost: 200,
    icon: <Award className="w-10 h-10 text-green-500" />,
  },
  {
    id: 6,
    title: "Special Title",
    description: "Earn a unique title displayed on your profile.",
    xpCost: 150,
    icon: <Star className="w-10 h-10 text-indigo-500" />,
  },
];

export default function ShopPage() {
  // Simulated user's XP for demo purposes
  const userXP = 320;

  // Motion variants for card hover effect
  const cardVariants = {
    hover: { scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.12)" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-[#1cb0f6]">Reward Shop</h1>
        <p className="text-xl text-gray-700 mt-4">
          Redeem your hard-earned XP for exciting rewards!
        </p>
        <div className="mt-6">
          <span className="px-4 py-2 bg-white rounded-full shadow text-2xl font-bold text-gray-800">
            Your XP: {userXP}
          </span>
        </div>
      </header>

      {/* Featured Rewards */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRewards.map((reward) => (
            <motion.div
              key={reward.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                {reward.icon}
                <h3 className="text-2xl font-semibold text-gray-800">{reward.title}</h3>
              </div>
              <p className="text-gray-600 flex-grow">{reward.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-gray-800">{reward.xpCost} XP</span>
                <button
                  disabled={userXP < reward.xpCost}
                  className={`px-4 py-2 rounded-md font-semibold text-white transition ${
                    userXP >= reward.xpCost
                      ? "bg-[#58cc02] hover:bg-[#46A302]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {userXP >= reward.xpCost ? "Redeem" : "Locked"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Rewards */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">All Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {allRewards.map((reward) => (
            <motion.div
              key={reward.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                {reward.icon}
                <h3 className="text-2xl font-semibold text-gray-800">{reward.title}</h3>
              </div>
              <p className="text-gray-600 flex-grow">{reward.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-gray-800">{reward.xpCost} XP</span>
                <button
                  disabled={userXP < reward.xpCost}
                  className={`px-4 py-2 rounded-md font-semibold text-white transition ${
                    userXP >= reward.xpCost
                      ? "bg-[#58cc02] hover:bg-[#46A302]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {userXP >= reward.xpCost ? "Redeem" : "Locked"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-xl font-medium text-[#1cb0f6] hover:underline"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>Back to Dashboard</span>
        </Link>
      </footer>
    </div>
  );
}
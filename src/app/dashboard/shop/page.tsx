"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Award, Gift, Star, ShoppingCart, Shirt, Coffee, Book, Bookmark, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

// Merchandise categories
const categories = [
  { id: "all", name: "All Items" },
  { id: "apparel", name: "Apparel" },
  { id: "accessories", name: "Accessories" },
  { id: "digital", name: "Digital Items" },
];

// Shop merchandise
const merchandise = [
  {
    id: 1,
    title: "WikiVerse T-Shirt",
    description: "Premium cotton t-shirt with WikiVerse logo.",
    xpCost: 1200,
    category: "apparel",
    image: "/images/tshirt-placeholder.png",
    icon: <Shirt className="w-10 h-10 text-green-500" />,
  },
  {
    id: 2,
    title: "Knowledge Mug",
    description: "Ceramic mug featuring famous quotes from history.",
    xpCost: 800,
    category: "accessories",
    image: "/images/mug-placeholder.png",
    icon: <Coffee className="w-10 h-10 text-purple-500" />,
  },
  {
    id: 3,
    title: "Digital Notebook",
    description: "Exclusive digital notebook with custom WikiVerse templates.",
    xpCost: 500,
    category: "digital",
    image: "/images/notebook-placeholder.png",
    icon: <Book className="w-10 h-10 text-blue-500" />,
  },
  {
    id: 4,
    title: "Premium Profile Badge",
    description: "Show off your dedication with this exclusive profile badge.",
    xpCost: 300,
    category: "digital",
    image: "/images/badge-placeholder.png",
    icon: <Award className="w-10 h-10 text-yellow-500" />,
  },
  {
    id: 5,
    title: "WikiVerse Stickers",
    description: "Set of 5 vinyl stickers with WikiVerse themes.",
    xpCost: 600,
    category: "accessories",
    image: "/images/stickers-placeholder.png",
    icon: <Star className="w-10 h-10 text-pink-500" />,
  },
  {
    id: 6,
    title: "Wooden Bookmark",
    description: "Handcrafted wooden bookmark with WikiVerse engraving.",
    xpCost: 700,
    category: "accessories",
    image: "/images/bookmark-placeholder.png",
    icon: <Bookmark className="w-10 h-10 text-amber-700" />,
  },
];

// Featured merchandise (first 2 items)
const featuredMerchandise = merchandise.slice(0, 2);

interface UserStats {
  xp: number;
  level: number;
  levelProgress: number;
  edits?: number;
  editsThisWeek?: number;
  activeQuests?: number;
  completedQuests?: number;
  articlesWatched?: number;
  articlesUpdated?: number;
}

const calculateXpProgress = (totalXP: number, level: number) => {
  const currentLevelXP = 500 * Math.pow(level, 1.5);
  const nextLevelXP = 500 * Math.pow(level + 1, 1.5);

  const levelProgress = Math.floor(
    ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  );

  return Math.max(0, Math.min(levelProgress, 100));
};

export default function ShopPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    levelProgress: 0,
  });

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching user stats...");
      const response = await fetch("/api/users/stats", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to fetch user stats: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("Received user stats:", data);

      if (data.success) {
        const xp = Number(data.xp);
        const level = Number(data.level);
        const levelProgress = calculateXpProgress(xp, level);

        console.log("Calculated level progress:", levelProgress);

        setUserStats({
          xp: xp,
          level: level,
          levelProgress: levelProgress,
          edits: Number(data.edits) || 0,
          editsThisWeek: Number(data.editsThisWeek) || 0,
          activeQuests: Number(data.activeQuests) || 0,
          completedQuests: Number(data.completedQuests) || 0,
          articlesWatched: Number(data.articlesWatched) || 0,
          articlesUpdated: Number(data.articlesUpdated) || 0,
        });

        console.log("Updated userStats state:", {
          xp: xp,
          level: level,
          levelProgress: levelProgress,
        });
      } else {
        console.error("API returned success: false with message:", data.message);
        toast.error(data.message || "Error fetching stats");

        if (process.env.NODE_ENV === "development") {
          const mockXp = 1500;
          const mockLevel = 3;
          const mockLevelProgress = calculateXpProgress(mockXp, mockLevel);

          setUserStats({
            xp: mockXp,
            level: mockLevel,
            levelProgress: mockLevelProgress,
            edits: 45,
            editsThisWeek: 12,
            activeQuests: 2,
            completedQuests: 8,
            articlesWatched: 15,
            articlesUpdated: 7,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error("Could not load your XP. Please try again.");

      if (process.env.NODE_ENV === "development") {
        const mockXp = 1500;
        const mockLevel = 3;
        const mockLevelProgress = calculateXpProgress(mockXp, mockLevel);

        setUserStats({
          xp: mockXp,
          level: mockLevel,
          levelProgress: mockLevelProgress,
          edits: 45,
          editsThisWeek: 12,
          activeQuests: 2,
          completedQuests: 8,
          articlesWatched: 15,
          articlesUpdated: 7,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const filteredMerchandise =
    selectedCategory === "all"
      ? merchandise.slice(2)
      : merchandise.filter(
          (item) => item.category === selectedCategory && !featuredMerchandise.includes(item)
        );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  type MerchandiseItem = typeof merchandise[number];

  const handlePurchase = async (item: MerchandiseItem) => {
    if (isLoading || isPurchasing) return;

    if (userStats.xp >= item.xpCost) {
      setIsPurchasing(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setPurchaseSuccess(true);

        setTimeout(() => {
          setPurchaseSuccess(false);

          setUserStats((prev) => {
            const newXp = prev.xp - item.xpCost;
            const newLevelProgress = calculateXpProgress(newXp, prev.level);

            return {
              ...prev,
              xp: newXp,
              levelProgress: newLevelProgress,
            };
          });

          toast.success(`You've purchased ${item.title}!`);
          setIsPurchasing(false);
        }, 1500);
      } catch (error) {
        console.error("Error processing purchase:", error);
        toast.error("Failed to process your purchase. Please try again.");
        setIsPurchasing(false);
      }
    } else {
      toast.error("Not enough XP for this item!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F0] to-[#f0f8ff] p-6 relative">
      {purchaseSuccess && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 backdrop-blur-sm"></div>
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-xl text-center z-10"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Awesome!</h2>
            <p className="text-lg text-gray-700">Your item is on its way!</p>
          </motion.div>
        </motion.div>
      )}

      <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
        <div className="bg-white rounded-full shadow-md px-3 py-2 border-2 border-[#ff9600]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#ff9600] rounded-full flex items-center justify-center text-white font-bold mr-2">
              {isLoading ? "..." : userStats.level}
            </div>
            <span className="text-xl font-extrabold text-[#ff9600]">Level</span>
          </div>
        </div>

        <div className="bg-white rounded-full shadow-md px-3 py-2 border-2 border-[#58cc02] flex items-center">
          <div className="w-8 h-8 bg-[#58cc02] rounded-full flex items-center justify-center text-white font-bold mr-2">
            XP
          </div>
          <span className="text-xl font-extrabold text-[#58cc02]">
            {isLoading ? <span className="animate-pulse">Loading...</span> : userStats.xp}
          </span>
        </div>
      </div>

      <header className="mb-16 text-center pt-16">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block mb-4 relative"
        >
          <motion.div
            className="absolute -top-12 right-0 left-0 mx-auto w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, rotate: 360 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-12 h-12 text-[#ffde00]" />
          </motion.div>

          <h1 className="text-5xl font-extrabold text-[#1cb0f6] relative z-10">WikiVerse Shop</h1>
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#ffde00] rounded-full -z-0 transform translate-y-2"></div>
        </motion.div>

        <motion.p
          className="text-xl text-gray-700 mt-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Redeem your hard-earned <span className="font-bold text-[#58cc02]">XP</span> for exclusive
          WikiVerse merchandise! The more you contribute, the more you earn.
        </motion.p>

        <motion.div
          className="mt-6 p-4 bg-white rounded-2xl shadow-md max-w-md mx-auto border-2 border-[#ececec]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <div className="h-6 w-full bg-gray-200 animate-pulse rounded-full"></div>
          ) : (
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#1cb0f6] bg-blue-100">
                    Level Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-[#1cb0f6]">
                    {userStats.levelProgress}%
                  </span>
                </div>
              </div>
              <div className="flex h-4 mb-4 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  style={{ width: `${userStats.levelProgress}%` }}
                  className="flex flex-col justify-center bg-gradient-to-r from-[#1cb0f6] to-[#58cc02] text-white shadow-none"
                  initial={{ width: "0%" }}
                  animate={{ width: `${userStats.levelProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Keep contributing to level up and unlock more rewards!
              </p>
            </div>
          )}
        </motion.div>
      </header>

      <div className="flex justify-center mb-8 gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${
              selectedCategory === category.id
                ? "bg-[#58cc02] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-[#ff4b4b] rounded-full mr-3"></div>
          <h2 className="text-3xl font-extrabold text-gray-800">Featured Items</h2>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-8"
        >
          {featuredMerchandise.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.12)" }}
              className="bg-white rounded-3xl p-6 border-2 border-[#ececec] shadow-md flex flex-col overflow-hidden"
            >
              <div className="h-48 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 flex-grow mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-[#58cc02] rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs">
                    XP
                  </div>
                  <span className="text-xl font-bold text-gray-800">{item.xpCost}</span>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={isLoading || isPurchasing || userStats.xp < item.xpCost}
                  className={`px-6 py-3 rounded-xl font-bold text-white transition ${
                    !isLoading && !isPurchasing && userStats.xp >= item.xpCost
                      ? "bg-[#58cc02] hover:bg-[#46a302] shadow-md"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isLoading
                    ? "Loading..."
                    : isPurchasing
                    ? "Processing..."
                    : userStats.xp >= item.xpCost
                    ? "Purchase Now"
                    : "Not Enough XP"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-[#1cb0f6] rounded-full mr-3"></div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            {selectedCategory === "all"
              ? "All Items"
              : categories.find((c) => c.id === selectedCategory)?.name || "Items"}
          </h2>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMerchandise.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-2xl p-5 border-2 border-[#ececec] shadow flex flex-col"
            >
              <div className="h-32 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-[#58cc02] rounded-full flex items-center justify-center text-white font-bold mr-1 text-xs">
                    XP
                  </div>
                  <span className="text-lg font-bold text-gray-800">{item.xpCost}</span>
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={isLoading || isPurchasing || userStats.xp < item.xpCost}
                  className={`px-4 py-2 rounded-lg font-bold text-sm text-white transition ${
                    !isLoading && !isPurchasing && userStats.xp >= item.xpCost
                      ? "bg-[#58cc02] hover:bg-[#46a302]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isLoading
                    ? "..."
                    : isPurchasing
                    ? "..."
                    : userStats.xp >= item.xpCost
                    ? "Purchase"
                    : "Locked"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="mt-12 text-center pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 font-bold text-lg text-[#1cb0f6] hover:text-[#0e8fd0] transition-colors bg-white px-6 py-3 rounded-full shadow-md"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </footer>
    </div>
  );
}
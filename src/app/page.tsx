"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import * as Form from "@radix-ui/react-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import Image from "next/image";

// Dynamically import the Globe component
const World = dynamic(
  () => import("../components/globe").then((m) => m.World),
  { ssr: false }
);

const useGlobeConfig = (pulseEffect = false) => ({
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: pulseEffect ? 0.15 : 0.1,
  emissive: "#062056",
  emissiveIntensity: pulseEffect ? 0.3 : 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: pulseEffect ? "#4ade80" : "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: pulseEffect ? 3 : 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: pulseEffect ? 1.0 : 0.5,
});

const generateSampleArcs = () => {
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
  
  return [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.15,
      color: getRandomColor(),
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.25,
      color: getRandomColor(),
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.35,
      color: getRandomColor(),
    },
    {
      order: 4,
      startLat: 51.5074,
      startLng: -0.1278,
      endLat: 48.8566,
      endLng: 2.3522,
      arcAlt: 0.2,
      color: getRandomColor(),
    },
    {
      order: 5,
      startLat: 52.5200,
      startLng: 13.4050,
      endLat: 55.7558,
      endLng: 37.6173,
      arcAlt: 0.18,
      color: getRandomColor(),
    },
  ];
};

// Achievement badges component
interface AchievementBadgeProps {
  title: string;
  description: string;
  points?: number;
}
const AchievementBadge: React.FC<AchievementBadgeProps> = ({ title, description, points = 50 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white border-2 border-[#58cc02] rounded-xl p-4 shadow-lg max-w-sm flex gap-3 items-center"
  >
    <div className="bg-[#e5f8d9] p-2 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#58cc02]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <div className="bg-[#58cc02] rounded-full px-2 py-1 text-white font-bold text-sm">
      +{points} XP
    </div>
  </motion.div>
);

// XP Progress bar component
const XPProgressBar = ({ progress, level }: { progress: number; level: number; }) => (
  <div className="w-full mt-4 mb-2">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-bold text-[#4b4b4b]">Guardian Level {level}</span>
      <span className="text-xs font-medium text-[#4b4b4b]">{progress}%</span>
    </div>
    <div className="w-full bg-[#e5e5e5] rounded-full h-3">
      <motion.div 
        className="bg-[#58cc02] h-3 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5 }}
      />
    </div>
  </div>
);

// Animated Guardian character
interface GuardianProps {
  emotion?: 'happy' | 'excited' | 'thinking' | 'greeting';
}
const Guardian: React.FC<GuardianProps> = ({ emotion = "happy" }) => {
  const emotions = {
    happy: "🧙‍♂️",
    excited: "🤩",
    thinking: "🤔",
    greeting: "👋",
  };

  return (
    <motion.div 
      initial={{ y: 10 }} 
      animate={{ y: [0, -10, 0] }} 
      transition={{ repeat: Infinity, duration: 2 }}
      className="text-5xl md:text-6xl select-none"
    >
      {emotions[emotion] || emotions.happy}
    </motion.div>
  );
};

// Tip component
interface TipProps {
  text: string;
}
const Tip: React.FC<TipProps> = ({ text }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-[#fff4d4] border-l-4 border-[#ffc800] p-3 text-sm text-[#4b4b4b] rounded-r mt-4"
  >
    <span className="font-bold">Tip:</span> {text}
  </motion.div>
);

interface GameBadgeProps {
  count: string;
  icon: string;
}
const GameBadge: React.FC<GameBadgeProps> = ({ count, icon }) => (
  <div className="flex items-center justify-center flex-col">
    <div className="bg-[#58cc02] text-white w-10 h-10 rounded-full flex items-center justify-center mb-1">
      {icon}
    </div>
    <span className="text-xs font-bold">{count}</span>
  </div>
);

const WikiForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userExists, setUserExists] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [xpProgress, setXpProgress] = useState(0);
  const [tipMessage, setTipMessage] = useState("");
  const [guardianEmotion, setGuardianEmotion] = useState<"greeting" | "happy" | "excited" | "thinking">("greeting");
  const router = useRouter();

  // Check if user exists when email is entered
  const checkUserExists = async (email: string) => {
    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleEmailSubmit = async () => {
    if (!email) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setGuardianEmotion("thinking");
    
    try {
      const exists = await checkUserExists(email);
      setUserExists(exists);
      setStep(2);
      setGuardianEmotion(exists ? "happy" : "excited");
      
      if (exists) {
        setTipMessage("Welcome back! Enter your password to continue your journey.");
      } else {
        setTipMessage("Exciting! Choose a unique username to start your Guardian journey.");
      }
    } catch (error) {
      setError("Couldn't verify email. Please try again.");
      setGuardianEmotion("thinking");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#58cc02', '#ffc800', '#1cb0f6']
    });
  };

  const simulateXpGain = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setXpProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          triggerConfetti();
          setShowAchievement(true);
          setGuardianEmotion("excited");
        }, 500);
      }
    }, 100);
  };

  const handleFinish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (userExists) {
        // Login flow
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError(result.error);
          setGuardianEmotion("thinking");
        } else {
          // Successful login
          setGuardianEmotion("excited");
          simulateXpGain();
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        }
      } else {
        // Registration flow
        if (!username) {
          setError("Please choose a username");
          setGuardianEmotion("thinking");
          setIsLoading(false);
          return;
        }
        
        try {
          const registerResponse = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
          });
          
          const registerData = await registerResponse.json();

          if (!registerResponse.ok) {
            setError(registerData.message || "Registration failed");
            setGuardianEmotion("thinking");
          } else {
            // Add a small delay before auto-login to ensure the user is properly saved
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Auto-login after registration
            const loginResult = await signIn("credentials", {
              redirect: false,
              email,
              password,
            });
            
            if (loginResult?.error) {
              console.error("Auto-login error:", loginResult.error);
              setError("Account created! Please log in with your new credentials.");
              setStep(1); // Go back to email step
              setEmail(""); // Clear email to force re-entry
              setPassword(""); // Clear password
              setGuardianEmotion("thinking");
            } else {
              setGuardianEmotion("excited");
              simulateXpGain();
              setTimeout(() => {
                router.push("/onboard");
              }, 3000);
            }
          }
        } catch (error) {
          console.error("Registration error:", error);
          setError("Registration failed. Please try again later.");
          setGuardianEmotion("thinking");
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      setGuardianEmotion("thinking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setGuardianEmotion("greeting");
    setError("");
  };

  return (
    <>
      <AnimatePresence>
        {showAchievement && (
          <motion.div 
            className="fixed top-10 right-10 z-50"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, delay: 3 }}
          >
            <AchievementBadge 
              title={userExists ? "Welcome Back!" : "New Guardian Unlocked!"}
              description={userExists 
                ? "Returned to continue your knowledge quest" 
                : "Your journey as a Wiki Guardian begins now"} 
              points={userExists ? 20 : 100}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center w-full"
      >
        <div className="flex w-full justify-between mb-6 px-4">
          <GameBadge count="Daily" icon="🔥" />
          <GameBadge count="24" icon="💎" />
          <GameBadge count="320" icon="🏆" />
        </div>

        <div className="w-24 h-24 flex items-center justify-center mb-4">
          <Guardian emotion={guardianEmotion} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="email-step" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <h2 className="text-xl font-bold text-center text-[#4b4b4b] mb-6">
                What's your email?
              </h2>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#fee7e6] border border-[#ffd2d2] text-[#d33] p-3 rounded-md text-sm mb-4"
                >
                  {error}
                </motion.div>
              )}
              
              <Form.Root onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
                <Form.Field name="email">
                  <div className="flex flex-col space-y-1.5">
                    <Form.Control asChild>
                      <input
                        className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#1cb0f6] focus:ring-1 focus:ring-[#1cb0f6] text-lg"
                        type="email"
                        required
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Control>
                  </div>
                </Form.Field>
                
                <Form.Submit asChild>
                  <button 
                    disabled={isLoading || !email}
                    className={`w-full mt-4 py-3 px-4 rounded-xl font-bold text-white text-lg transition-colors ${isLoading || !email ? 'bg-[#e5e5e5] cursor-not-allowed' : 'bg-[#58cc02] hover:bg-[#46a302]'}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </div>
                    ) : "Continue"}
                  </button>
                </Form.Submit>
              </Form.Root>
            </motion.div>
          ) : (
            <motion.div 
              key="credentials-step" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="flex items-center mb-2">
                <button 
                  onClick={handleBackToEmail}
                  className="text-[#1cb0f6] hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {email}
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-center text-[#4b4b4b] mb-6">
                {userExists ? "Enter your password" : "Create your account"}
              </h2>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#fee7e6] border border-[#ffd2d2] text-[#d33] p-3 rounded-md text-sm mb-4"
                >
                  {error}
                </motion.div>
              )}
              
              <Form.Root className="space-y-4" onSubmit={handleFinish}>
                {!userExists && (
                  <Form.Field name="username">
                    <div className="flex flex-col space-y-1.5">
                      <Form.Control asChild>
                        <input
                          className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#1cb0f6] focus:ring-1 focus:ring-[#1cb0f6] text-lg"
                          type="text"
                          required
                          placeholder="Choose a username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </Form.Control>
                    </div>
                  </Form.Field>
                )}

                <Form.Field name="password">
                  <div className="flex flex-col space-y-1.5">
                    <Form.Control asChild>
                      <input
                        className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#1cb0f6] focus:ring-1 focus:ring-[#1cb0f6] text-lg"
                        type="password"
                        required
                        placeholder={userExists ? "Password" : "Create a password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Control>
                  </div>
                </Form.Field>

                {tipMessage && <Tip text={tipMessage} />}

                {xpProgress > 0 && (
                  <XPProgressBar progress={xpProgress} level={1} />
                )}
                
                <Form.Submit asChild>
                  <button 
                    disabled={isLoading || !password || (!userExists && !username)}
                    className={`w-full mt-2 py-3 px-4 rounded-xl font-bold text-white text-lg transition-colors ${isLoading || !password || (!userExists && !username) ? 'bg-[#e5e5e5] cursor-not-allowed' : 'bg-[#58cc02] hover:bg-[#46a302]'}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {userExists ? "Signing In..." : "Creating Account..."}
                      </div>
                    ) : (
                      userExists ? "Sign In" : "Create Account"
                    )}
                  </button>
                </Form.Submit>
              </Form.Root>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export function Page() {
  const [pulseGlobe, setPulseGlobe] = useState(false);
  const globeConfig = useGlobeConfig(pulseGlobe);
  const sampleArcs = React.useMemo(() => generateSampleArcs(), []);
  const router = useRouter();

  // Check if user is already authenticated and redirect to /dashboard
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 min-h-screen bg-[#f9f9f9] text-[#202122] w-full">
      <div className="w-full md:w-1/2 relative h-80 md:h-[70vh] flex items-center justify-center">
        <div className="absolute w-[90%] h-[90%] md:w-[80%] md:h-[80%] rounded-xl overflow-hidden">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>

      <div className="w-full md:w-1/2 px-6 py-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1cb0f6] mb-3">
              Wiki Guardian
            </h1>
            <p className="text-base md:text-lg text-[#4b4b4b]">
              Join our community of knowledge keepers who protect the world's wisdom.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-md">
            <WikiForm />
          </div>

          <div className="mt-6 text-xs text-[#777] text-center">
            <p>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Page;
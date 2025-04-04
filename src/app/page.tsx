"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import * as Form from "@radix-ui/react-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const World = dynamic(
  () => import("../components/globe").then((m) => m.World),
  { ssr: false }
);

const useGlobeConfig = () => ({
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
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

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First try to sign in
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      // If sign in fails...
      if (result?.error) {
        // If the email does not exist, try to register
        if (result.error.includes("No user found")) {
          const usernameBase = email.split('@')[0];
          const randomSuffix = Math.floor(Math.random() * 10000);
          const username = `${usernameBase}${randomSuffix}`;

          const registerResponse = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
          });
          const registerData = await registerResponse.json();

          if (!registerResponse.ok) {
            if (registerData.message.includes("already exists")) {
              // If user is found, try signing in again
              const loginAfterRegister = await signIn("credentials", {
                redirect: false,
                email,
                password,
              });
              if (loginAfterRegister?.error) {
                setError("Account exists but couldn't log in automatically. Please try logging in again.");
                setIsLoading(false);
                return;
              }
            } else {
              setError(registerData.message || "Registration failed");
              setIsLoading(false);
              return;
            }
          } else {
            // Successfully registered, sign in again
            const loginAfterRegister = await signIn("credentials", {
              redirect: false,
              email,
              password,
            });
            if (loginAfterRegister?.error) {
              setError("Account created but couldn't log in automatically. Please try logging in again.");
              setIsLoading(false);
              return;
            }
            router.push("/onboard");
            return;
          }
        } else {
          // If error is not "No user found," it’s likely wrong password or some other issue
          setError(result.error);
          setIsLoading(false);
          return;
        }
      }

      // If sign in was successful, redirect
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form.Root className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-[#fee7e6] border border-[#ffd2d2] text-[#d33] p-3 rounded-sm text-sm">
          {error}
        </div>
      )}
      
      <Form.Field name="email">
        <div className="flex flex-col space-y-1.5">
          <Form.Label className="text-sm font-medium text-[#54595d]">Email</Form.Label>
          <Form.Control asChild>
            <input
              className="w-full px-3 py-2 border border-[#a2a9b1] rounded-sm focus:outline-none focus:border-[#3366cc] focus:ring-1 focus:ring-[#3366cc]"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Control>
          <Form.Message className="text-sm text-[#d33]" match="valueMissing">
            Please enter your email
          </Form.Message>
          <Form.Message className="text-sm text-[#d33]" match="typeMismatch">
            Please enter a valid email
          </Form.Message>
        </div>
      </Form.Field>

      <Form.Field name="password">
        <div className="flex flex-col space-y-1.5">
          <Form.Label className="text-sm font-medium text-[#54595d]">Password</Form.Label>
          <Form.Control asChild>
            <input
              className="w-full px-3 py-2 border border-[#a2a9b1] rounded-sm focus:outline-none focus:border-[#3366cc] focus:ring-1 focus:ring-[#3366cc]"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Control>
          <Form.Message className="text-sm text-[#d33]" match="valueMissing">
            Please enter your password
          </Form.Message>
        </div>
      </Form.Field>

      <div className="pt-2">
        <Form.Submit asChild>
          <button 
            className="w-full bg-[#3366cc] text-white py-2 px-4 rounded-sm hover:bg-[#2a4b8d] transition-colors font-medium flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In / Register"
            )}
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
};

export function Page() {
  const globeConfig = useGlobeConfig();
  const sampleArcs = React.useMemo(() => generateSampleArcs(), []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-6 min-h-screen bg-[#f8f9fa] text-[#202122] w-full">
      <div className="w-full md:w-1/2 relative h-80 md:h-[70vh] flex items-center justify-center">
        <div className="absolute w-[90%] h-[90%] md:w-[80%] md:h-[80%] rounded-lg overflow-hidden">
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
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#162860] mb-3">
              Become the Wiki Guardian
            </h1>
            <p className="text-base md:text-lg text-[#54595d] leading-relaxed border-l-4 border-[#eaecf0] pl-4 italic">
              Join our community of knowledge keepers who curate and protect the collective wisdom of humanity. Your journey as a Guardian begins here.
            </p>
          </div>

          <div className="bg-white border border-[#c8ccd1] rounded-sm p-6 shadow-sm">
            <LoginForm />

            <div className="mt-4 text-center">
              <p className="text-sm text-[#54595d]">
                Don't have an account?{" "}
                <a href="#" className="text-[#3366cc] hover:underline">
                  Create one
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6 text-xs text-[#72777d] text-center">
            <p>
              This page was last edited on 3 April 2025, at 14:22 (UTC).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Page;
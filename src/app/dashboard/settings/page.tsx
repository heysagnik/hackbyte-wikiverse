"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// Toggle switch
const Toggle = ({ id, checked, onChange, label }: { 
  id: string; 
  checked: boolean; 
  onChange: () => void; 
  label: string;
}) => (
  <div className="flex items-center p-4 bg-white rounded-lg mb-3 border border-gray-100 hover:border-green-200 transition-colors">
    <div className="flex-grow">
      <label htmlFor={id} className="font-medium text-gray-700">{label}</label>
    </div>
    <label className="inline-flex items-center cursor-pointer"></label>
      <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
      <div 
        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
        style={{ backgroundColor: checked ? '#58CC02' : '#E5E5E5' }}
      ></div>
  </div>
);

// Dropdown select
const Select = ({ id, value, onChange, label, options }: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: {value: string, label: string}[];
}) => (
  <div className="flex items-center p-4 bg-white rounded-lg mb-3 border border-gray-100 hover:border-green-200 transition-colors">
    <div className="flex-grow">
      <label htmlFor={id} className="font-medium text-gray-700">{label}</label>
    </div>
    <select 
      id={id} 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="form-select rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Connection card
const ConnectionCard = ({ connected, serviceName, icon, onToggle, isLoading }: {
  connected: boolean;
  serviceName: string;
  icon: React.ReactNode;
  onToggle: () => void;
  isLoading?: boolean;
}) => (
  <div className="flex items-center p-4 bg-white rounded-lg mb-3 border border-gray-100 hover:border-green-200 transition-colors">
    <div className="mr-4 text-gray-500">
      {icon}
    </div>
    <div className="flex-grow">
      <h3 className="font-medium text-gray-700">{serviceName}</h3>
      <p className="text-sm text-gray-500">
        {connected ? 'Connected' : 'Not connected'}
      </p>
    </div>
    <button 
      onClick={onToggle}
      disabled={isLoading}
      className={`px-3 py-1 rounded-lg text-sm font-medium ${
        isLoading 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : connected 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : 'bg-green-100 text-green-600 hover:bg-green-200'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </span>
      ) : (
        connected ? 'Disconnect' : 'Connect'
      )}
    </button>
  </div>
);

// Settings category
const SettingsCategory = ({ children, title, icon }: { children: React.ReactNode; title: string; icon?: React.ReactNode }) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      {icon && <div className="mr-3 text-green-500">{icon}</div>}
      <h2 className="text-lg font-bold text-gray-700">{title}</h2>
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

// Settings page
export default function Settings() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [wikiConnectionLoading, setWikiConnectionLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    level: 1,
    xp: 0,
    contributions: 0,
    streak: 0
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    highContrast: false,
    shareProgress: true,
    language: 'en',
    wikipediaConnected: false
  });
  
  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
    { value: 'ar', label: 'العربية' },
    { value: 'hi', label: 'हिन्दी' },
  ];
  
  // Check authentication and fetch user data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    
    if (status === "authenticated" && session?.user) {
      fetchUserData();
    }
  }, [status, session, router]);
  
  // Fetch user profile
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let profileData;
      try {
        const profileRes = await fetch('/api/users/profile');
        if (!profileRes.ok) {
          throw new Error(`Failed to fetch profile: ${profileRes.statusText}`);
        }
        
        profileData = await profileRes.json();
        if (!profileData.success) {
          throw new Error(profileData.message || 'Failed to load user data');
        }
        
        // Set user data
        const user = profileData.user || {};
        setUserData({
          displayName: user.displayName || user.username || (session?.user as any)?.name || 'User',
          email: user.email || (session?.user as any)?.email || '',
          level: user.level || (session?.user as any)?.level || 1,
          xp: user.xp || (session?.user as any)?.xp || 0,
          contributions: user.contributions || (session?.user as any)?.contributions || 0,
          streak: user.streak || 0
        });
      } catch (profileErr) {
        console.error("Error fetching user profile:", profileErr);
      }
      
      // Fetch user settings
      try {
        const settingsRes = await fetch('/api/users/settings');
        if (!settingsRes.ok) {
          console.warn(`Settings API returned ${settingsRes.status}: ${settingsRes.statusText}`);
          setSettings({
            darkMode: false,
            highContrast: false,
            shareProgress: true,
            language: 'en',
            wikipediaConnected: false
          });
          return;
        }
        
        const settingsData = await settingsRes.json();
        if (!settingsData.success) {
          throw new Error(settingsData.message || 'Failed to load settings');
        }
        
        setSettings({
          darkMode: settingsData.settings?.darkMode || false,
          highContrast: settingsData.settings?.highContrast || false,
          shareProgress: settingsData.settings?.shareProgress !== false,
          language: settingsData.settings?.language || 'en',
          wikipediaConnected: settingsData.settings?.wikipediaConnected || false
        });
      } catch (settingsErr) {
        console.error("Error fetching settings:", settingsErr);
        setSettings({
          darkMode: false,
          highContrast: false,
          shareProgress: true,
          language: 'en',
          wikipediaConnected: false
        });
      }
      
    } catch (err) {
      console.error("General error in fetchUserData:", err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save user settings
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch('/api/users/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          settings: {
            darkMode: settings.darkMode,
            highContrast: settings.highContrast,
            shareProgress: settings.shareProgress,
            language: settings.language
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to save settings');
      }
      
      setSuccessMessage('Settings saved successfully!');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Toggle Wikipedia connection
  const toggleWikipediaConnection = async () => {
    try {
      setWikiConnectionLoading(true);
      setError(null);
      
      if (settings.wikipediaConnected) {
        const response = await fetch('/api/connections/wikipedia', {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to disconnect: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to disconnect from Wikipedia');
        }
        
        setSettings({...settings, wikipediaConnected: false});
      } else {
        // Simulate Wikipedia connection
        setTimeout(() => {
          setSettings({...settings, wikipediaConnected: true});
          setWikiConnectionLoading(false);
        }, 1500);
        return;
      }
      
    } catch (err) {
      console.error("Error toggling Wikipedia connection:", err);
      setError(err instanceof Error ? err.message : 'Failed to update Wikipedia connection');
    } finally {
      setWikiConnectionLoading(false);
    }
  };
  
  // Handle logout function
  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      setIsLoggingOut(true);
      try {
        await signOut({ callbackUrl: '/' });
      } catch (error) {
        console.error('Logout failed:', error);
        setIsLoggingOut(false);
      }
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#E5E5E5] rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#58CC02] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#4B4B4B] font-medium">Loading your settings...</p>
        </div>
      </div>
    );
  }
  
  // Function to get initials from display name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Main component render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Settings</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={saveSettings}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg text-white font-bold text-sm shadow-sm transition-all 
                  ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar with user profile */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-600 mb-4">
                  {getInitials(userData.displayName)}
                </div>
                <h2 className="font-bold text-gray-800 text-xl">{userData.displayName}</h2>
                <div className="flex items-center mt-2 mb-4">
                  <div className="px-3 py-1 rounded-full text-white text-xs font-bold bg-green-500">
                    Level {userData.level}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{userData.email.replace(/^(.{3})(.*)(@.*)$/, '$1***$3')}</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                <button className="w-full text-left p-3 flex items-center text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#58CC02">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  <span>Change Password</span>
                </button>
                <button className="w-full text-left p-3 flex items-center text-gray-700 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="#58CC02">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  <span>Download My Data</span>
                </button>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left p-3 flex items-center text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  {isLoggingOut ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5zm16 7l-4-4v3H9v2h8v3l4-4z"/>
                    </svg>
                  )}
                  <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main settings content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-8">
                Customize your Wiki-Wallah experience to match your preferences and learning style.
              </p>
              
              {/* User Stats */}
              <SettingsCategory 
                title="Your Stats" 
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 9h3v3h-3v-3zM5 7h3v3H5V7zm6 0h3v3h-3V7zm6 0h3v3h-3V7zM5 13h3v3H5v-3zm12 4h-9v-3h9v3z"/>
                  </svg>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M11.47 1.72a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 01-1.06-1.06l3-3zM11.25 7.5V15a.75.75 0 001.5 0V7.5h3.75a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9a3 3 0 013-3h3.75z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#4B5563]">XP</span>
                    </div>
                    <span className="text-xl font-bold text-[#1F2937]">{userData.xp}</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA] rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21a8.25 8.25 0 01-6.038-7.047 8.287 8.287 0 009-3.566c.236-.586.469-1.173.69-1.766z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#4B5563]">Streak</span>
                    </div>
                    <span className="text-xl font-bold text-[#92400E]">{userData.streak} days 🔥</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#4B5563]">Contributions</span>
                    </div>
                    <span className="text-xl font-bold text-[#1E40AF]">{userData.contributions}</span>
                  </div>
                </div>
              </SettingsCategory>
              
              {/* Language Section */}
              <SettingsCategory 
                title="Language" 
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                  </svg>
                }
              >
                <Select
                  id="language"
                  value={settings.language}
                  onChange={(value) => setSettings({...settings, language: value})}
                  label="Interface Language"
                  options={languageOptions}
                />
              </SettingsCategory>
              
              {/* Appearance Section */}
              <SettingsCategory 
                title="Appearance" 
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
                    <path d="M12 17c2.76 0 5-2.24 5-5s-2.24-5-5-5v10z"/>
                  </svg>
                }
              >
                <Toggle 
                  id="darkMode" 
                  checked={settings.darkMode} 
                  onChange={() => setSettings({...settings, darkMode: !settings.darkMode})} 
                  label="Dark Mode" 
                />
                <Toggle 
                  id="highContrast" 
                  checked={settings.highContrast} 
                  onChange={() => setSettings({...settings, highContrast: !settings.highContrast})} 
                  label="High Contrast Mode" 
                />
              </SettingsCategory>
              
              {/* Privacy Section */}
              <SettingsCategory 
                title="Privacy" 
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                }
              >
                <Toggle 
                  id="shareProgress" 
                  checked={settings.shareProgress} 
                  onChange={() => setSettings({...settings, shareProgress: !settings.shareProgress})} 
                  label="Share my learning progress with the community" 
                />
              </SettingsCategory>
              
              {/* Connected Accounts Section */}
              <SettingsCategory 
                title="Connected Accounts" 
                icon={
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                }
              >
                <ConnectionCard
                  connected={settings.wikipediaConnected}
                  serviceName="Wikipedia Account"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      xmlnsXlink="http://www.w3.org/1999/xlink" 
                      height="24px" 
                      width="24px" 
                      version="1.1" 
                      id="Layer_1" 
                      viewBox="0 0 458.723 458.723" 
                      xmlSpace="preserve">
                      <path style={{ fill: "#222A30" }} d="M455.724,93.489H367.32h-3v3v9.613v3h3h6.143c7.145,0,13.588,3.667,17.237,9.81  c3.648,6.143,3.786,13.555,0.368,19.829l-98.3,180.432l-44.769-106.727l42.169-77.382c8.727-16.014,25.477-25.962,43.714-25.962  h1.992h3v-3v-9.613v-3h-3H247.47h-3v3v9.613v3h3h6.143c7.145,0,13.588,3.667,17.237,9.81c3.648,6.143,3.786,13.555,0.368,19.829  l-30.587,56.143L213.372,129.9c-1.976-4.71-1.487-9.852,1.341-14.105s7.38-6.693,12.488-6.693h6.988h3v-3v-9.613v-3h-3H128.46h-3v3  v9.613v3h3h1.454c20.857,0,39.546,12.428,47.615,31.661l40.277,96.018l-44.887,82.392L93.523,129.9  c-1.976-4.71-1.487-9.852,1.341-14.105s7.38-6.693,12.488-6.693h10.737h3v-3v-9.613v-3h-3H3H0v3v9.613v3h3h7.064  c20.857,0,39.547,12.428,47.615,31.661l91.526,218.191c1.601,3.816,5.313,6.282,9.458,6.282c3.804,0,7.163-1.998,8.986-5.344  l11.939-21.91l45.582-83.646l43.884,104.617c1.601,3.816,5.313,6.282,9.458,6.282c3.804,0,7.163-1.998,8.986-5.344l11.939-21.91  l110.58-202.919c8.727-16.014,25.477-25.962,43.714-25.962h1.992h3v-3v-9.613v-3h-2.999V93.489z"/>
                    </svg>
                  }
                  onToggle={toggleWikipediaConnection}
                  isLoading={wikiConnectionLoading}
                />
              </SettingsCategory>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
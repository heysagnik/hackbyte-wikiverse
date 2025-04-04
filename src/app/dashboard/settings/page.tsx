"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// Toggle switch component
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
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
      <div 
        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
        style={{ backgroundColor: checked ? '#58CC02' : '#E5E5E5' }}
      ></div>
    </label>
  </div>
);

// Dropdown select component
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

// Connection card component
const ConnectionCard = ({ connected, serviceName, icon, onToggle }: {
  connected: boolean;
  serviceName: string;
  icon: React.ReactNode;
  onToggle: () => void;
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
      className={`px-3 py-1 rounded-lg text-sm font-medium ${
        connected 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-green-100 text-green-600 hover:bg-green-200'
      }`}
    >
      {connected ? 'Disconnect' : 'Connect'}
    </button>
  </div>
);

// Settings category component
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

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [shareProgress, setShareProgress] = useState(true);
  const [language, setLanguage] = useState('en');
  const [wikipediaConnected, setWikipediaConnected] = useState(false);
  
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
              <button className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold text-sm shadow-sm hover:bg-green-600 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar with user profile */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <div className="flex flex-col items-center pb-6 mb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-600 mb-4">
                  WG
                </div>
                <h2 className="font-bold text-gray-800 text-xl">WikiGuardian</h2>
                <div className="flex items-center mt-2 mb-4">
                  <div className="px-3 py-1 rounded-full text-white text-xs font-bold bg-green-500">
                    Level 12
                  </div>
                </div>
                <span className="text-sm text-gray-500">wiki*****@example.com</span>
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
                <button className="w-full text-left p-3 flex items-center text-red-500 hover:bg-red-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main settings content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-8">
                Customize your WikiVerse experience to match your preferences and learning style.
              </p>
              
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
                  value={language}
                  onChange={setLanguage}
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
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                  label="Dark Mode" 
                />
                <Toggle 
                  id="highContrast" 
                  checked={highContrast} 
                  onChange={() => setHighContrast(!highContrast)} 
                  label="Light Mode" 
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
                  connected={wikipediaConnected}
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
                  onToggle={() => setWikipediaConnected(!wikipediaConnected)}
                />
              </SettingsCategory>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
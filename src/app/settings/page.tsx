"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const SettingsTab = ({ id, label, activeTab, onClick }: { id: string; label: string; activeTab: string; onClick: (id: string) => void }) => (
    <button
        onClick={() => onClick(id)}
        className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === id
                ? 'border-[#3366cc] text-[#3366cc]'
                : 'border-transparent text-[#54595d] hover:border-[#c8ccd1] hover:text-[#202122]'
        }`}
    >
        {label}
    </button>
);

const Toggle = ({ id, checked, onChange, label, description }: {
    id: string;
    checked: boolean;
    onChange: () => void;
    label: string;
    description?: string;
}) => (
    <div className="flex items-start py-4 border-b border-[#eaecf0] last:border-0">
        <div className="flex-grow">
            <label htmlFor={id} className="font-medium text-[#202122]">{label}</label>
            {description && <p className="text-sm text-[#54595d] mt-1">{description}</p>}
        </div>
        <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
            <div className="relative w-11 h-6 bg-[#eaecf0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3366cc]"></div>
        </label>
    </div>
);

const RadioOption = ({ id, name, value, checked, onChange, label }: {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    label: string;
}) => (
    <div className="flex items-center py-2">
        <input
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={() => onChange(value)}
            className="w-4 h-4 text-[#3366cc] border-[#c8ccd1] focus:ring-[#3366cc]"
        />
        <label htmlFor={id} className="ml-2 text-sm font-medium text-[#202122]">
            {label}
        </label>
    </div>
);

export default function Settings() {
    const [activeTab, setActiveTab] = useState('account');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [webNotifications, setWebNotifications] = useState(true);
    const [watchlistAlerts, setWatchlistAlerts] = useState(true);
    const [mentionAlerts, setMentionAlerts] = useState(true);
    const [theme, setTheme] = useState('system');
    const [editorPreference, setEditorPreference] = useState('visual');
    const [language, setLanguage] = useState('en');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl text-[#202122] font-serif mb-3">Settings</h1>
                <p className="text-[#54595d] md:text-lg">
                    Customize your WikiVerse experience and manage your account preferences.
                </p>
            </header>

            <div className="border-b border-[#c8ccd1] mb-8 flex overflow-x-auto">
                <SettingsTab id="account" label="Account" activeTab={activeTab} onClick={setActiveTab} />
                <SettingsTab id="notifications" label="Notifications" activeTab={activeTab} onClick={setActiveTab} />
                <SettingsTab id="appearance" label="Appearance" activeTab={activeTab} onClick={setActiveTab} />
                <SettingsTab id="editing" label="Editing" activeTab={activeTab} onClick={setActiveTab} />
                <SettingsTab id="privacy" label="Privacy & Security" activeTab={activeTab} onClick={setActiveTab} />
            </div>

            {activeTab === 'account' && (
                <div className="space-y-8">
                    <div className="bg-white border border-[#c8ccd1] rounded-md p-5 shadow-sm">
                        <h2 className="text-xl text-[#202122] font-serif mb-4 pb-2 border-b border-[#eaecf0]">Profile Information</h2>
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-[#eaf3ff] rounded-full flex items-center justify-center text-[#3366cc] border-2 border-[#dae6fc]">
                                <span className="text-xl font-medium">WG</span>
                            </div>
                            <button className="px-4 py-2 text-sm text-[#3366cc] bg-[#f8f9fa] border border-[#c8ccd1] rounded-md hover:bg-[#eaf3ff] transition-colors">
                                Change avatar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-[#54595d] mb-1">Display name</label>
                                <input 
                                    type="text" 
                                    id="displayName" 
                                    defaultValue="WikiGuardian"
                                    className="w-full px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-[#54595d] mb-1">Username</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    defaultValue="WikiGuardian"
                                    className="w-full px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent bg-[#f8f9fa]"
                                    disabled
                                />
                                <p className="text-xs text-[#72777d] mt-1">Username cannot be changed</p>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#54595d] mb-1">Email address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    defaultValue="wikiguardian@example.com"
                                    className="w-full px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-[#54595d] mb-1">Bio / About</label>
                                <textarea 
                                    id="bio" 
                                    rows={3}
                                    defaultValue="I'm a passionate contributor focused on environmental and science topics."
                                    className="w-full px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 text-white bg-[#3366cc] rounded-md hover:bg-[#2a4c8f] transition-colors">
                                Save changes
                            </button>
                        </div>
                    </div>
                    <div className="bg-white border border-[#c8ccd1] rounded-md p-5 shadow-sm">
                        <h2 className="text-xl text-[#202122] font-serif mb-4 pb-2 border-b border-[#eaecf0]">Account Management</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-md border border-[#eaecf0]">
                                <div>
                                    <h3 className="font-medium text-[#202122]">Change password</h3>
                                    <p className="text-sm text-[#54595d]">Update your password for better security</p>
                                </div>
                                <button className="px-4 py-2 text-sm text-[#3366cc] bg-white border border-[#c8ccd1] rounded-md hover:bg-[#eaf3ff] transition-colors">
                                    Change
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-md border border-[#eaecf0]">
                                <div>
                                    <h3 className="font-medium text-[#202122]">Connected accounts</h3>
                                    <p className="text-sm text-[#54595d]">Manage OAuth and third-party connections</p>
                                </div>
                                <button className="px-4 py-2 text-sm text-[#3366cc] bg-white border border-[#c8ccd1] rounded-md hover:bg-[#eaf3ff] transition-colors">
                                    Manage
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#fff7f7] rounded-md border border-[#ffd2d2]">
                                <div>
                                    <h3 className="font-medium text-[#d33]">Delete account</h3>
                                    <p className="text-sm text-[#72777d]">Permanently delete your account and all data</p>
                                </div>
                                <button className="px-4 py-2 text-sm text-[#d33] bg-white border border-[#ffd2d2] rounded-md hover:bg-[#fee7e6] transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="bg-white border border-[#c8ccd1] rounded-md p-5 shadow-sm">
                    <h2 className="text-xl text-[#202122] font-serif mb-4 pb-2 border-b border-[#eaecf0]">Notification Preferences</h2>
                    <div className="mb-6">
                        <h3 className="text-[#54595d] font-medium mb-3">Delivery methods</h3>
                        <div className="space-y-4">
                            <Toggle
                                id="emailNotifications"
                                checked={emailNotifications}
                                onChange={() => setEmailNotifications(!emailNotifications)}
                                label="Email notifications"
                                description="Receive notifications via email"
                            />
                            <Toggle
                                id="webNotifications"
                                checked={webNotifications}
                                onChange={() => setWebNotifications(!webNotifications)}
                                label="Browser notifications"
                                description="Receive notifications in your browser when you're online"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[#54595d] font-medium mb-3">Notification types</h3>
                        <div className="space-y-4">
                            <Toggle
                                id="watchlistAlerts"
                                checked={watchlistAlerts}
                                onChange={() => setWatchlistAlerts(!watchlistAlerts)}
                                label="Watchlist alerts"
                                description="Get notified when changes are made to articles you're watching"
                            />
                            <Toggle
                                id="mentionAlerts"
                                checked={mentionAlerts}
                                onChange={() => setMentionAlerts(!mentionAlerts)}
                                label="Mentions and replies"
                                description="Get notified when someone mentions you or replies to your comments"
                            />
                            <Toggle
                                id="thankYouAlerts"
                                checked={true}
                                onChange={() => {}}
                                label="Thank you notifications"
                                description="Get notified when someone thanks you for your edits"
                            />
                            <Toggle
                                id="achievementAlerts"
                                checked={true}
                                onChange={() => {}}
                                label="Achievements and milestones"
                                description="Get notified when you earn badges or reach contribution milestones"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="px-4 py-2 text-white bg-[#3366cc] rounded-md hover:bg-[#2a4c8f] transition-colors">
                            Save preferences
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'appearance' && (
                <div className="bg-white border border-[#c8ccd1] rounded-md p-5 shadow-sm">
                    <h2 className="text-xl text-[#202122] font-serif mb-4 pb-2 border-b border-[#eaecf0]">Appearance Settings</h2>
                    <div className="mb-8">
                        <h3 className="text-[#54595d] font-medium mb-3">Theme</h3>
                        <div className="space-y-2">
                            <RadioOption
                                id="themeSystem"
                                name="theme"
                                value="system"
                                checked={theme === 'system'}
                                onChange={setTheme}
                                label="Use system setting"
                            />
                            <RadioOption
                                id="themeLight"
                                name="theme"
                                value="light"
                                checked={theme === 'light'}
                                onChange={setTheme}
                                label="Light mode"
                            />
                            <RadioOption
                                id="themeDark"
                                name="theme"
                                value="dark"
                                checked={theme === 'dark'}
                                onChange={setTheme}
                                label="Dark mode"
                            />
                        </div>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-[#54595d] font-medium mb-3">Font size</h3>
                        <div className="flex items-center">
                            <span className="text-sm text-[#54595d] mr-3">A</span>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                defaultValue="3"
                                className="w-full h-2 bg-[#eaecf0] rounded-lg appearance-none cursor-pointer accent-[#3366cc]"
                            />
                            <span className="text-lg text-[#54595d] ml-3">A</span>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-[#54595d] font-medium mb-3">Display language</h3>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>
                    <div>
                        <h3 className="text-[#54595d] font-medium mb-3">Interface layout</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                className={`border-2 rounded-md p-4 cursor-pointer ${
                                    true ? 'border-[#3366cc] bg-[#eaf3ff]' : 'border-[#c8ccd1]'
                                }`}
                            >
                                <div className="h-20 bg-[#f8f9fa] mb-3 border border-[#c8ccd1] rounded-md flex flex-col">
                                    <div className="h-4 w-1/3 bg-[#eaecf0] m-2 rounded"></div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-xs text-[#72777d]">Standard view</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="font-medium text-sm">Vector (Default)</span>
                                </div>
                            </div>
                            <div
                                className={`border-2 rounded-md p-4 cursor-pointer ${
                                    false ? 'border-[#3366cc] bg-[#eaf3ff]' : 'border-[#c8ccd1]'
                                }`}
                            >
                                <div className="h-20 bg-[#f8f9fa] mb-3 border border-[#c8ccd1] rounded-md flex flex-col">
                                    <div className="h-4 w-1/3 bg-[#eaecf0] m-2 rounded"></div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-xs text-[#72777d]">Compact view</div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="font-medium text-sm">Compact</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="px-4 py-2 text-white bg-[#3366cc] rounded-md hover:bg-[#2a4c8f] transition-colors">
                            Save preferences
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'editing' && (
                <div className="bg-white border border-[#c8ccd1] rounded-md p-5 shadow-sm">
                    <h2 className="text-xl text-[#202122] font-serif mb-4 pb-2 border-b border-[#eaecf0]">Editing Preferences</h2>
                    <div className="mb-8">
                        <h3 className="text-[#54595d] font-medium mb-3">Default editor</h3>
                        <div className="space-y-2">
                            <RadioOption
                                id="editorVisual"
                                name="editor"
                                value="visual"
                                checked={editorPreference === 'visual'}
                                onChange={setEditorPreference}
                                label="Visual editor (What You See Is What You Get)"
                            />
                            <RadioOption
                                id="editorWikitext"
                                name="editor"
                                value="wikitext"
                                checked={editorPreference === 'wikitext'}
                                onChange={setEditorPreference}
                                label="Source editor (Wikitext)"
                            />
                            <RadioOption
                                id="editorSplit"
                                name="editor"
                                value="split"
                                checked={editorPreference === 'split'}
                                onChange={setEditorPreference}
                                label="Split view (Visual and source side-by-side)"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 mb-8">
                        <Toggle
                            id="promptToSave"
                            checked={true}
                            onChange={() => {}}
                            label="Prompt to save"
                            description="Show a confirmation dialog when leaving an edit page with unsaved changes"
                        />
                        <Toggle
                            id="showPreview"
                            checked={true}
                            onChange={() => {}}
                            label="Show preview before saving"
                            description="Display a preview of your changes before saving an edit"
                        />
                        <Toggle
                            id="editSummary"
                            checked={true}
                            onChange={() => {}}
                            label="Require edit summary"
                            description="Prompt for an edit summary when one is not provided"
                        />
                        <Toggle
                            id="autoWatchEdits"
                            checked={true}
                            onChange={() => {}}
                            label="Automatically watch pages I edit"
                            description="Add pages you edit to your watchlist"
                        />
                    </div>
                    <div className="mb-8">
                        <h3 className="text-[#54595d] font-medium mb-3">Advanced options</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="undoLimit" className="block text-sm text-[#54595d] mb-1">Maximum undo levels</label>
                                <select
                                    id="undoLimit"
                                    defaultValue="20"
                                    className="px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="syntaxHighlighting" className="block text-sm text-[#54595d] mb-1">Syntax highlighting theme</label>
                                <select
                                    id="syntaxHighlighting"
                                    defaultValue="default"
                                    className="px-3 py-2 border border-[#c8ccd1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3366cc] focus:border-transparent"
                                >
                                    <option value="default">Default</option>
                                    <option value="monokai">Monokai</option>
                                    <option value="github">GitHub</option>
                                    <option value="tomorrow">Tomorrow</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="px-4 py-2 text-white bg-[#3366cc] rounded-md hover:bg-[#2a4c8f] transition-colors">
                            Save preferences
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'privacy' && (
                <div className="space-y-8">
                    <div className="bg-white border border-[#c8ccd1] rounded-md p-5 shadow-sm">
                        <h2 className="text-xl text-[#202122] font-serif mb-4 pb-2 border-b border-[#eaecf0]">Privacy Settings</h2>
                        <div className="space-y-4 mb-6">
                            <Toggle
                                id="showEmail"
                                checked={false}
                                onChange={() => {}}
                                label="Show my email address to other users"
                                description="Allow other users to contact you via email through your profile"
                            />
                            <Toggle
                                id="showEdits"
                                checked={true}
                                onChange={() => {}}
                                label="Show my edit history on my profile"
                                description="Display your recent edits and contributions on your public profile"
                            />
                            <Toggle
                                id="hideOnlineStatus"
                                checked={false}
                                onChange={() => {}}
                                label="Hide my online status"
                                description="Don't show when you're active on WikiVerse"
                            />
                        </div>
                        <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#eaecf0] mb-4">
                            <h3 className="font-medium text-[#202122] mb-2">Data & privacy</h3>
                            <p className="text-sm text-[#54595d] mb-3">
                                Your contributions to WikiVerse are generally public and recorded in the site's history.
                                Some information, like your user preferences and account information, is stored privately.
                            </p>
                            <div className="flex space-x-3">
                                <Link href="#" className="text-sm text-[#3366cc] hover:underline">Privacy policy</Link>
                                <Link href="#" className="text-sm text-[#3366cc] hover:underline">Download my data</Link>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-[#c8ccd1] rounded-md p-5 shadow-sm">
                        <h2 className="text-xl text-[#202122] font-serif mb-4 pb-2 border-b border-[#eaecf0]">Security Settings</h2>
                        <div className="mb-6">
                            <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-md border border-[#eaecf0] mb-4">
                                <div>
                                    <h3 className="font-medium text-[#202122]">Two-factor authentication</h3>
                                    <p className="text-sm text-[#54595d]">Add an extra layer of security to your account</p>
                                </div>
                                <div className="flex items-center">
                                    <span className={`mr-3 text-sm ${twoFactorEnabled ? 'text-green-600' : 'text-[#72777d]'}`}>
                                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                    <button
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                                            twoFactorEnabled
                                                ? 'text-[#d33] border-[#ffd2d2] hover:bg-[#fee7e6]'
                                                : 'text-[#3366cc] border-[#c8ccd1] hover:bg-[#eaf3ff]'
                                        }`}
                                    >
                                        {twoFactorEnabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-md border border-[#eaecf0]">
                                    <div>
                                        <h3 className="font-medium text-[#202122]">Recent login activity</h3>
                                        <p className="text-sm text-[#54595d]">Monitor where your account has been accessed</p>
                                    </div>
                                    <button className="px-4 py-2 text-sm text-[#3366cc] bg-white border border-[#c8ccd1] rounded-md hover:bg-[#eaf3ff] transition-colors">
                                        View activity
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-md border border-[#eaecf0]">
                                    <div>
                                        <h3 className="font-medium text-[#202122]">Connected devices</h3>
                                        <p className="text-sm text-[#54595d]">See all devices logged into your account</p>
                                    </div>
                                    <button className="px-4 py-2 text-sm text-[#3366cc] bg-white border border-[#c8ccd1] rounded-md hover:bg-[#eaf3ff] transition-colors">
                                        Manage devices
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="w-full py-3 text-[#d33] border border-[#ffd2d2] rounded-md hover:bg-[#fee7e6] transition-colors font-medium">
                                Sign out from all devices
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
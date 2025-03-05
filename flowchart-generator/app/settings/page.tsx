'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/providers/ThemeProvider';
import AppLayout from '@/components/Layout/AppLayout';

export default function Settings() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [defaultNodeColor, setDefaultNodeColor] = useState('#FFDC62');
  const [defaultConnectionColor, setDefaultConnectionColor] = useState('#FFDC62');
  const [autoSave, setAutoSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call to save settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would save to your API/database
    console.log('Settings saved:', {
      theme,
      defaultNodeColor,
      defaultConnectionColor,
      autoSave,
    });
    
    setIsSaving(false);
  };
  
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="bg-light-darker dark:bg-dark-lighter rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <span className="mr-2">Theme:</span>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center px-3 py-1 rounded-full bg-light dark:bg-dark"
              >
                {theme === 'dark' ? (
                  <>
                    <span className="mr-2">🌙</span>
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">☀️</span>
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </label>
            <p className="text-sm text-dark-lighter dark:text-light-darker mt-1">
              Toggle between dark and light mode for the application interface.
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="defaultNodeColor" className="block mb-2">
              Default Node Color:
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="defaultNodeColor"
                value={defaultNodeColor}
                onChange={(e) => setDefaultNodeColor(e.target.value)}
                className="h-10 w-10 rounded cursor-pointer mr-2"
              />
              <input
                type="text"
                value={defaultNodeColor}
                onChange={(e) => setDefaultNodeColor(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-dark-darker border border-gray-300 dark:border-gray-700 rounded"
              />
            </div>
            <p className="text-sm text-dark-lighter dark:text-light-darker mt-1">
              Set the default color for new flow chart nodes.
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="defaultConnectionColor" className="block mb-2">
              Default Connection Color:
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="defaultConnectionColor"
                value={defaultConnectionColor}
                onChange={(e) => setDefaultConnectionColor(e.target.value)}
                className="h-10 w-10 rounded cursor-pointer mr-2"
              />
              <input
                type="text"
                value={defaultConnectionColor}
                onChange={(e) => setDefaultConnectionColor(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-dark-darker border border-gray-300 dark:border-gray-700 rounded"
              />
            </div>
            <p className="text-sm text-dark-lighter dark:text-light-darker mt-1">
              Set the default color for flow chart connections.
            </p>
          </div>
        </div>
        
        <div className="bg-light-darker dark:bg-dark-lighter rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Editor Preferences</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="mr-2"
              />
              <span>Auto-save</span>
            </label>
            <p className="text-sm text-dark-lighter dark:text-light-darker mt-1">
              Automatically save flow charts while editing.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className={`btn-primary ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
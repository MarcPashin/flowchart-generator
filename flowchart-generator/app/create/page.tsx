'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AppLayout from '@/components/Layout/AppLayout';
import FlowChartCanvas from '@/components/FlowChart/FlowChartCanvas';
import NodeSelector from '@/components/FlowChart/NodeSelector';
import ColorPicker from '@/components/FlowChart/ColorPicker';
import { toPng } from 'html-to-image';
import { supabase } from '@/supabaseClient'; // Adjust the import path as necessary

export default function CreateFlowChart() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('Untitled Flow Chart');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get flow chart data from the canvas
      const flowChartData = (window as any).exportFlowChart();
      
      
      
    
      
      alert('Flow chart saved successfully!');
    } catch (error) {
      console.error('Error saving flow chart:', error);
      alert('Failed to save flow chart. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Hide mini map and tools
      const miniMap = document.querySelector('.react-flow__minimap') as HTMLElement;
      const controls = document.querySelector('.react-flow__controls') as HTMLElement;
      if (miniMap) miniMap.style.display = 'none';
      if (controls) controls.style.display = 'none';

      const element = document.querySelector('.react-flow') as HTMLElement;
      if (!element) throw new Error('Canvas not found');
      
      const dataUrl = await toPng(element, {
        backgroundColor: 'transparent',
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
        },
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      // Restore mini map and tools
      if (miniMap) miniMap.style.display = '';
      if (controls) controls.style.display = '';
    } catch (error) {
      console.error('Error downloading flow chart:', error);
      alert('Failed to download flow chart. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              autoFocus
              className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary-dark px-2 py-1 rounded"
            />
          ) : (
            <h1 
              className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors duration-200" 
              onClick={() => setIsEditing(true)}
              title="Click to edit title"
            >
              {title}
            </h1>
          )}
          
          <div className="flex gap-3">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary hover:bg-secondary-dark text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download as PNG image"
            >
              {isDownloading ? 'Downloading...' : 'Download PNG'}
            </button>
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title={session ? 'Save to your account' : 'Save as guest'}
            >
              {isSaving ? 'Saving...' : (session ? 'Save' : 'Save as Guest')}
            </button>
          </div>
        </div>
        
        <div className="flex gap-4 h-full">
          <div className="flex-1 bg-light-darker dark:bg-dark-lighter rounded-lg overflow-hidden shadow-lg">
            <FlowChartCanvas />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
'use client';

import { useState } from 'react';

// Node type definitions with improved descriptions
const nodeTypes = [
  {
    id: 'start',
    label: 'Start',
    description: 'Add a starting point (required)',
    color: '#4F46E5',
    shape: (
      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-current" />
      </div>
    ),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'process',
    label: 'Process',
    description: 'Add a process or action step',
    color: '#10B981',
    shape: (
      <div className="w-6 h-6 border-2 border-current" />
    ),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'decision',
    label: 'Decision',
    description: 'Add a yes/no decision point',
    color: '#F59E0B',
    shape: (
      <div className="w-6 h-6 rotate-45 border-2 border-current" />
    ),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'input',
    label: 'Input/Output',
    description: 'Add data input or output',
    color: '#EC4899',
    shape: (
      <div className="w-6 h-6 transform -skew-x-12 border-2 border-current" />
    ),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
  },
  {
    id: 'end',
    label: 'End',
    description: 'Add an end point (required)',
    color: '#EF4444',
    shape: (
      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-current" />
      </div>
    ),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function NodeSelector() {
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeType(nodeId);
    
    // Dispatch custom event to add node
    const event = new CustomEvent('addNode', { detail: { type: nodeId } });
    window.dispatchEvent(event);
    
    // Show feedback
    setFeedback(`Added ${nodeId} node`);
    setTimeout(() => setFeedback(''), 2000);
  };

  const onDragStart = (event: React.DragEvent, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType.id,
      data: {
        label: nodeType.label,
        color: nodeType.color,
      }
    }));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Add Node</h3>
      
      {feedback && (
        <div className="mb-3 p-2 bg-primary/10 text-primary rounded-md text-sm">
          {feedback}
        </div>
      )}
      
      <div className="space-y-2">
        {nodeTypes.map((nodeType) => (
          <button
            key={nodeType.id}
            onClick={() => handleNodeSelect(nodeType.id)}
            draggable
            onDragStart={(e) => onDragStart(e, nodeType)}
            className={`w-full flex items-center gap-2 p-2 rounded-md transition-all duration-300 hover:scale-102 cursor-grab active:cursor-grabbing ${
              selectedNodeType === nodeType.id
                ? 'bg-primary/20 border-2 border-primary'
                : 'bg-light dark:bg-dark hover:bg-light-darker dark:hover:bg-dark-lighter'
            }`}
            title={`Drag or click to add ${nodeType.label.toLowerCase()} node`}
          >
            <div className="flex items-center gap-2">
              <div style={{ color: nodeType.color }}>{nodeType.shape}</div>
              <span className={`${
                selectedNodeType === nodeType.id
                  ? 'text-primary'
                  : 'text-primary/70'
              }`}>
                {nodeType.icon}
              </span>
            </div>
            <div className="text-left">
              <div className="font-medium">{nodeType.label}</div>
              <div className="text-xs text-dark-lighter dark:text-light-darker">{nodeType.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
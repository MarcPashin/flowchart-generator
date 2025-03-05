'use client';

import { useState } from 'react';

const defaultColors = [
  { id: 'primary', color: '#FFDC62', label: 'Primary (Yellow)' },
  { id: 'blue', color: '#60A5FA', label: 'Blue' },
  { id: 'green', color: '#34D399', label: 'Green' },
  { id: 'red', color: '#F87171', label: 'Red' },
  { id: 'purple', color: '#A78BFA', label: 'Purple' },
  { id: 'orange', color: '#FBBF24', label: 'Orange' },
  { id: 'pink', color: '#F472B6', label: 'Pink' },
  { id: 'teal', color: '#2DD4BF', label: 'Teal' },
];

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState(defaultColors[0].id);
  const [customColor, setCustomColor] = useState('#FFDC62');
  
  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    const selectedColorObj = defaultColors.find((c) => c.id === colorId);
    if (selectedColorObj) {
      setCustomColor(selectedColorObj.color);
    }
    
    // Here you would update the application state with the selected color
    console.log(`Selected color: ${colorId}`);
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setSelectedColor('custom');
    
    // Here you would update the application state with the custom color
    console.log(`Custom color: ${e.target.value}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {defaultColors.map((colorOption) => (
          <button
            key={colorOption.id}
            onClick={() => handleColorSelect(colorOption.id)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === colorOption.id
                ? 'border-white dark:border-gray-300'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: colorOption.color }}
            title={colorOption.label}
          />
        ))}
      </div>
      
      <div>
        <label htmlFor="customColor" className="block text-sm font-medium mb-1">
          Custom Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            id="customColor"
            value={customColor}
            onChange={handleCustomColorChange}
            className="h-8 w-8 rounded cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={handleCustomColorChange}
            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-dark-darker border border-gray-300 dark:border-gray-700 rounded"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Apply To</h4>
        <div className="space-y-2">
          <button className="btn-secondary w-full text-sm py-1">All Nodes</button>
          <button className="btn-secondary w-full text-sm py-1">Selected Node</button>
          <button className="btn-secondary w-full text-sm py-1">Connections</button>
        </div>
      </div>
    </div>
  )};
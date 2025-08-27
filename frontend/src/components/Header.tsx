import React from 'react';
import { Brain, Languages } from 'lucide-react';

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
  useGrounding: boolean;
  onUseGroundingChange: (useGrounding: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  useGrounding,
  onUseGroundingChange
}) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-blue-800">AI Scheme Assistant</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="grounding-toggle"
              checked={useGrounding}
              onChange={(e) => onUseGroundingChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="grounding-toggle" className="text-sm font-medium text-gray-700">
              Latest Updates
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-500" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
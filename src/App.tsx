import React, { useState, useEffect } from 'react';
import { Calculator, Book, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import CalculatorModule from './components/CalculatorModule';
import FormulaLibrary from './components/FormulaLibrary';
import ConversionSidebar from './components/ConversionSidebar';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'formulas'>('calculator');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'calculator' as const, label: 'Calculator', icon: Calculator },
    { id: 'formulas' as const, label: 'Formula Library', icon: Book },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'w-80' : 'w-0'} 
          transition-all duration-300 ease-in-out overflow-hidden
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          border-r flex-shrink-0
        `}>
          <ConversionSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className={`
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
            border-b p-4 flex items-center justify-between
          `}>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Calculator By Rajat
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          {/* Tab Navigation */}
          <nav className={`
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
            border-b px-4
          `}>
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 py-3 font-medium text-sm rounded-t-lg flex items-center space-x-2 transition-colors
                      ${activeTab === tab.id
                        ? theme === 'dark'
                          ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400'
                          : 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Tab Content */}
          <main className="flex-1 overflow-hidden">
            {activeTab === 'calculator' && <CalculatorModule />}
            {activeTab === 'formulas' && <FormulaLibrary />}
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
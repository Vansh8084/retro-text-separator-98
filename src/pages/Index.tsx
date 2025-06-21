
import React, { useState } from 'react';
import WindowHeader from '@/components/WindowHeader';
import TextProcessor from '@/components/TextProcessor';

const Index = () => {
  const [activeSection, setActiveSection] = useState('processor');

  const handleMinimize = () => {
    console.log('Minimize clicked');
  };

  const handleMaximize = () => {
    console.log('Maximize clicked');
  };

  const handleClose = () => {
    console.log('Close clicked');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'processor':
        return <TextProcessor />;
      case 'home':
        return (
          <div className="flex-1 p-4">
            <div className="win98-panel p-4 h-full">
              <h2 className="text-sm font-bold mb-4">Welcome to Text Separator 98</h2>
              <div className="win98-panel-inset p-4">
                <div className="text-xs space-y-2">
                  <p>This application helps you detect and separate different types of content from raw text:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Content separated by &lt;_&gt; tags</li>
                    <li>• Custom text separators</li>
                    <li>• Automatic content detection</li>
                  </ul>
                  <p className="mt-4">Click on "Text Processor" to get started!</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <TextProcessor />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--win98-bg)' }}>
      <div className="h-screen flex flex-col win98-panel">
        <WindowHeader
          title="Text Separator 98 - Microsoft Windows"
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
        />
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            {renderContent()}
          </div>
          
          {/* Bottom Navigation */}
          <div className="win98-panel border-t border-gray-400 p-1">
            <div className="flex justify-center gap-2">
              <button
                className={`win98-button px-4 py-2 ${activeSection === 'home' ? 'win98-button-pressed' : ''}`}
                onClick={() => setActiveSection('home')}
              >
                🏠 Home
              </button>
              <button
                className={`win98-button px-4 py-2 ${activeSection === 'processor' ? 'win98-button-pressed' : ''}`}
                onClick={() => setActiveSection('processor')}
              >
                📝 Text Processor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

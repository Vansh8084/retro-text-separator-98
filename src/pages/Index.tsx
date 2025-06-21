
import React, { useState } from 'react';
import WindowHeader from '@/components/WindowHeader';
import Sidebar from '@/components/Sidebar';
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
                    <li>• Numbered lists (1., 2., 3., etc.)</li>
                    <li>• Lettered lists (a., b., c., etc.)</li>
                    <li>• Bullet points (-, *, •)</li>
                    <li>• Roman numerals (i., ii., iii., etc.)</li>
                    <li>• Step indicators (Step 1:, Step 2:, etc.)</li>
                  </ul>
                  <p className="mt-4">Click on "Text Processor" to get started!</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 p-4">
            <div className="win98-panel p-4 h-full">
              <h2 className="text-sm font-bold mb-4">Settings</h2>
              <div className="win98-panel-inset p-4">
                <div className="text-xs">Settings panel coming soon...</div>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="flex-1 p-4">
            <div className="win98-panel p-4 h-full">
              <h2 className="text-sm font-bold mb-4">Help</h2>
              <div className="win98-panel-inset p-4">
                <div className="text-xs space-y-2">
                  <p><strong>How to use:</strong></p>
                  <p>1. Click "Add Text" button</p>
                  <p>2. Paste or type your raw text</p>
                  <p>3. Click "Process Text"</p>
                  <p>4. Use Copy, Remove, or Copy & Remove buttons on each detected item</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="flex-1 p-4">
            <div className="win98-panel p-4 h-full">
              <h2 className="text-sm font-bold mb-4">About</h2>
              <div className="win98-panel-inset p-4">
                <div className="text-xs space-y-2">
                  <p><strong>Text Separator 98</strong></p>
                  <p>Version 1.0</p>
                  <p>A retro-styled text processing utility</p>
                  <p>Built with Windows 98 aesthetics</p>
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
    <div className="min-h-screen bg-gray-200" style={{ backgroundColor: 'var(--win98-bg)' }}>
      <div className="h-screen flex flex-col win98-panel">
        <WindowHeader
          title="Text Separator 98 - Microsoft Windows"
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
        />
        <div className="flex-1 flex">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;

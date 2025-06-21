
import React, { useState } from 'react';
import WindowHeader from '@/components/WindowHeader';
import TextProcessor from '@/components/TextProcessor';
import Sidebar from '@/components/Sidebar';
import { Filter, Plus } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('processor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFolder, setActiveFolder] = useState('saved');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleMinimize = () => {
    console.log('Minimize clicked');
  };

  const handleMaximize = () => {
    console.log('Maximize clicked');
  };

  const handleClose = () => {
    console.log('Close clicked');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'processor':
        return (
          <TextProcessor 
            activeFolder={activeFolder}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            showAddDialog={showAddDialog}
            setShowAddDialog={setShowAddDialog}
          />
        );
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
        return (
          <TextProcessor 
            activeFolder={activeFolder}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            showAddDialog={showAddDialog}
            setShowAddDialog={setShowAddDialog}
          />
        );
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
        
        {/* Header Controls */}
        <div className="win98-panel border-b border-gray-400 p-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                className="win98-button"
                onClick={toggleSidebar}
              >
                {sidebarOpen ? '◀' : '▶'} Folders
              </button>
              <button
                className="win98-button"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Text
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs">Items per page:</span>
              <select
                className="win98-input px-1 py-0 text-xs"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              
              <span className="text-xs">Page {currentPage}</span>
              <button
                className="win98-button px-2 py-0"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                ‹
              </button>
              <button
                className="win98-button px-2 py-0"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {sidebarOpen && (
            <Sidebar
              activeFolder={activeFolder}
              onFolderChange={setActiveFolder}
            />
          )}
          
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
    </div>
  );
};

export default Index;

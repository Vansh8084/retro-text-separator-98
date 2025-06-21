
import React, { useState, useEffect } from 'react';
import WindowHeader from '@/components/WindowHeader';
import TextProcessor from '@/components/TextProcessor';
import Sidebar from '@/components/Sidebar';
import HomePage from '@/components/HomePage';
import { Filter, Plus } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFolder, setActiveFolder] = useState('saved');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddFolderDialog, setShowAddFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState([
    { id: 'saved', label: 'Saved Content', icon: '📁', count: 0 },
    { id: 'removed', label: 'Removed Items', icon: '🗑️', count: 0 },
  ]);

  // Update folder counts
  useEffect(() => {
    const updateCounts = () => {
      try {
        const savedContent = localStorage.getItem('textSeparatorContent');
        const removedContent = localStorage.getItem('textSeparatorRemovedContent');
        
        const savedCount = savedContent ? JSON.parse(savedContent).length : 0;
        const removedCount = removedContent ? JSON.parse(removedContent).length : 0;
        
        setFolders(prev => [
          { ...prev[0], count: savedCount },
          { ...prev[1], count: removedCount },
          ...prev.slice(2)
        ]);
      } catch (error) {
        console.error('Error updating folder counts:', error);
      }
    };

    updateCounts();
    const interval = setInterval(updateCounts, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleFolderSelect = (folderId: string) => {
    setActiveFolder(folderId);
    setActiveSection('processor');
  };

  const handleAddFolder = () => {
    setShowAddFolderDialog(true);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: `folder_${Date.now()}`,
        label: newFolderName.trim(),
        icon: '📂',
        count: 0
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowAddFolderDialog(false);
    }
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, label: newName } : folder
    ));
  };

  const getCurrentData = () => {
    try {
      if (activeFolder === 'saved') {
        const saved = localStorage.getItem('textSeparatorContent');
        return saved ? JSON.parse(saved) : [];
      } else if (activeFolder === 'removed') {
        const removed = localStorage.getItem('textSeparatorRemovedContent');
        return removed ? JSON.parse(removed) : [];
      }
      return [];
    } catch {
      return [];
    }
  };

  const totalPages = Math.ceil(getCurrentData().length / itemsPerPage);

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
          <HomePage
            folders={folders}
            onFolderSelect={handleFolderSelect}
            onAddFolder={handleAddFolder}
            onRenameFolder={handleRenameFolder}
          />
        );
      default:
        return (
          <HomePage
            folders={folders}
            onFolderSelect={handleFolderSelect}
            onAddFolder={handleAddFolder}
            onRenameFolder={handleRenameFolder}
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
              
              {totalPages > 1 && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {sidebarOpen && (
            <Sidebar
              activeFolder={activeFolder}
              onFolderChange={setActiveFolder}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              folders={folders}
              onAddFolder={handleAddFolder}
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

        {/* Add Folder Dialog */}
        {showAddFolderDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 border-2 border-gray-400 p-4 min-w-96">
              <div className="win98-titlebar mb-2">
                <span>Create New Folder</span>
                <button
                  className="win98-control-button"
                  onClick={() => setShowAddFolderDialog(false)}
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-xs mb-1">Folder name:</label>
                <input
                  type="text"
                  className="win98-input"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="win98-button"
                  onClick={() => setShowAddFolderDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="win98-button"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

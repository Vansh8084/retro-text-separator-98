
import React from 'react';
import { Folder, Plus } from 'lucide-react';

interface SidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFolder, onFolderChange }) => {
  const folders = [
    { id: 'saved', label: 'Saved Content', icon: '📁', count: getSavedContentCount() },
    { id: 'removed', label: 'Removed Items', icon: '🗑️', count: getRemovedContentCount() },
  ];

  function getSavedContentCount() {
    try {
      const saved = localStorage.getItem('textSeparatorContent');
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  }

  function getRemovedContentCount() {
    try {
      const removed = localStorage.getItem('textSeparatorRemovedContent');
      return removed ? JSON.parse(removed).length : 0;
    } catch {
      return 0;
    }
  }

  return (
    <div className="w-56 h-full win98-panel border-r border-gray-400">
      <div className="p-2 border-b border-gray-400">
        <div className="text-xs font-bold mb-2 flex items-center">
          <Folder className="w-3 h-3 mr-1" />
          Folders
        </div>
      </div>
      
      <div className="p-1">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`sidebar-item ${activeFolder === folder.id ? 'active' : ''}`}
            onClick={() => onFolderChange(folder.id)}
          >
            <span className="mr-2">{folder.icon}</span>
            <span className="flex-1">{folder.label}</span>
            <span className="text-xs bg-gray-300 px-1 rounded">{folder.count}</span>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-gray-400 mt-4">
        <div className="text-xs font-bold mb-2">Actions</div>
        <div className="space-y-1">
          <button className="win98-button w-full text-xs py-1">
            <Filter className="w-3 h-3 mr-1" />
            Remove Duplicates
          </button>
          <button className="win98-button w-full text-xs py-1">
            <Plus className="w-3 h-3 mr-1" />
            Bulk Add Prefix
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { Folder, Plus, Filter, Edit, ChevronRight, ChevronDown } from 'lucide-react';

interface SidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  folders: Array<{
    id: string;
    label: string;
    icon: string;
    count: number;
  }>;
  onAddFolder: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeFolder, 
  onFolderChange, 
  currentPage, 
  totalPages, 
  onPageChange,
  folders,
  onAddFolder
}) => {
  const [expandedFolders, setExpandedFolders] = React.useState<{[key: string]: boolean}>({
    saved: true,
    removed: true
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  return (
    <div className="w-56 h-full win98-panel border-r border-gray-400">
      <div className="p-2 border-b border-gray-400">
        <div className="text-xs font-bold mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Folder className="w-3 h-3 mr-1" />
            Folders
          </div>
          <button
            className="win98-button px-1 py-0"
            onClick={onAddFolder}
            title="Add new folder"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="p-1">
        {folders.map((folder) => (
          <div key={folder.id}>
            <div className="flex items-center">
              <button
                className="win98-button px-1 py-0 mr-1"
                onClick={() => toggleFolder(folder.id)}
              >
                {expandedFolders[folder.id] ? 
                  <ChevronDown className="w-3 h-3" /> : 
                  <ChevronRight className="w-3 h-3" />
                }
              </button>
              <div
                className={`sidebar-item flex-1 ${activeFolder === folder.id ? 'active' : ''}`}
                onClick={() => onFolderChange(folder.id)}
              >
                <span className="mr-2">{folder.icon}</span>
                <span className="flex-1">{folder.label}</span>
                <span className="text-xs bg-gray-300 px-1 rounded">{folder.count}</span>
              </div>
            </div>
            
            {expandedFolders[folder.id] && activeFolder === folder.id && totalPages > 1 && (
              <div className="ml-6 mt-1">
                <div className="text-xs text-gray-600 mb-1">Pages:</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`win98-button px-2 py-0 text-xs ${currentPage === page ? 'win98-button-pressed' : ''}`}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

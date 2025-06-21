
import React, { useState } from 'react';
import { Folder, Plus, Edit } from 'lucide-react';

interface HomePageProps {
  folders: Array<{
    id: string;
    label: string;
    icon: string;
    count: number;
  }>;
  onFolderSelect: (folderId: string) => void;
  onAddFolder: () => void;
  onRenameFolder: (folderId: string, newName: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  folders, 
  onFolderSelect, 
  onAddFolder,
  onRenameFolder 
}) => {
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartRename = (folder: any) => {
    setEditingFolder(folder.id);
    setEditName(folder.label);
  };

  const handleSaveRename = () => {
    if (editingFolder && editName.trim()) {
      onRenameFolder(editingFolder, editName.trim());
    }
    setEditingFolder(null);
    setEditName('');
  };

  const handleCancelRename = () => {
    setEditingFolder(null);
    setEditName('');
  };

  return (
    <div className="flex-1 p-4">
      <div className="win98-panel p-4 h-full">
        <h2 className="text-sm font-bold mb-4">Text Separator 98 - My Folders</h2>
        
        <div className="win98-panel-inset p-4 h-5/6 overflow-y-auto win98-scrollbar">
          <div className="grid grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div key={folder.id} className="text-center">
                {editingFolder === folder.id ? (
                  <div className="space-y-2">
                    <div 
                      className="w-16 h-16 mx-auto flex items-center justify-center bg-yellow-200 border border-gray-400 cursor-pointer"
                    >
                      <span className="text-2xl">{folder.icon}</span>
                    </div>
                    <input
                      type="text"
                      className="win98-input text-xs w-full"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveRename()}
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button
                        className="win98-button text-xs px-1 py-0"
                        onClick={handleSaveRename}
                      >
                        ✓
                      </button>
                      <button
                        className="win98-button text-xs px-1 py-0"
                        onClick={handleCancelRename}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div 
                      className="w-16 h-16 mx-auto flex items-center justify-center bg-yellow-200 border border-gray-400 cursor-pointer hover:bg-yellow-300"
                      onDoubleClick={() => onFolderSelect(folder.id)}
                    >
                      <span className="text-2xl">{folder.icon}</span>
                    </div>
                    <div className="mt-2 text-xs">
                      <div className="font-bold">{folder.label}</div>
                      <div className="text-gray-600">({folder.count} items)</div>
                    </div>
                    <button
                      className="win98-button text-xs px-1 py-0 mt-1"
                      onClick={() => handleStartRename(folder)}
                      title="Rename folder"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add new folder button */}
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto flex items-center justify-center bg-gray-200 border border-gray-400 cursor-pointer hover:bg-gray-300 border-dashed"
                onClick={onAddFolder}
              >
                <Plus className="w-8 h-8 text-gray-600" />
              </div>
              <div className="mt-2 text-xs font-bold">Add Folder</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

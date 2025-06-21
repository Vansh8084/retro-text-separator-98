
import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'processor', label: '📝 Text Processor', icon: '📝' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
    { id: 'help', label: '❓ Help', icon: '❓' },
    { id: 'about', label: 'ℹ️ About', icon: 'ℹ️' },
  ];

  return (
    <div className="w-48 h-full win98-panel">
      <div className="p-2 border-b border-gray-400">
        <div className="text-xs font-bold mb-2">Navigation</div>
      </div>
      <div className="p-1">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label.replace(/^.+ /, '')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

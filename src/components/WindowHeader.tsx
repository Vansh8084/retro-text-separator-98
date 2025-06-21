
import React from 'react';

interface WindowHeaderProps {
  title: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({ 
  title, 
  onMinimize, 
  onMaximize, 
  onClose 
}) => {
  return (
    <div className="win98-titlebar">
      <div className="flex items-center">
        <div className="w-4 h-3 mr-1 bg-white border border-black flex items-center justify-center text-xs">
          📄
        </div>
        <span>{title}</span>
      </div>
      <div className="flex">
        <button 
          className="win98-control-button mr-px"
          onClick={onMinimize}
          title="Minimize"
        >
          _
        </button>
        <button 
          className="win98-control-button mr-px"
          onClick={onMaximize}
          title="Maximize"
        >
          ☐
        </button>
        <button 
          className="win98-control-button"
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default WindowHeader;

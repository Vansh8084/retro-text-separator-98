
import React from 'react';

interface ContentBoxProps {
  content: string;
  type: string;
  index: number;
  onCopy: (content: string) => void;
  onRemove: (index: number) => void;
  onCopyAndRemove: (content: string, index: number) => void;
}

const ContentBox: React.FC<ContentBoxProps> = ({
  content,
  type,
  index,
  onCopy,
  onRemove,
  onCopyAndRemove
}) => {
  return (
    <div className="content-box">
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs font-bold">{type} #{index + 1}</div>
        <div className="flex gap-1">
          <button
            className="win98-button"
            onClick={() => onCopy(content)}
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
          <button
            className="win98-button"
            onClick={() => onRemove(index)}
            title="Remove this item"
          >
            🗑️ Remove
          </button>
          <button
            className="win98-button"
            onClick={() => onCopyAndRemove(content, index)}
            title="Copy and remove"
          >
            📋🗑️ Copy & Remove
          </button>
        </div>
      </div>
      <div className="win98-panel-inset p-2 text-xs">
        <pre className="whitespace-pre-wrap font-mono">{content}</pre>
      </div>
    </div>
  );
};

export default ContentBox;

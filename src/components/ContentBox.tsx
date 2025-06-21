
import React, { useState } from 'react';
import { Edit } from 'lucide-react';

interface ContentBoxProps {
  content: string;
  type: string;
  index: number;
  onCopy: (content: string) => void;
  onRemove: (index: number) => void;
  onCopyAndRemove: (content: string, index: number) => void;
  onEdit: (index: number, newContent: string) => void;
}

const ContentBox: React.FC<ContentBoxProps> = ({
  content,
  type,
  index,
  onCopy,
  onRemove,
  onCopyAndRemove,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSaveEdit = () => {
    onEdit(index, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <div className="content-box">
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs font-bold">{type} #{index + 1}</div>
        <div className="flex gap-1">
          <button
            className="win98-button"
            onClick={() => setIsEditing(true)}
            title="Edit this item"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </button>
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
      
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            className="win98-input win98-scrollbar w-full"
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="win98-button"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="win98-button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="win98-panel-inset p-2 text-xs">
          <pre className="whitespace-pre-wrap font-mono">{content}</pre>
        </div>
      )}
    </div>
  );
};

export default ContentBox;


import React, { useState } from 'react';
import ContentBox from './ContentBox';
import { useToast } from '@/hooks/use-toast';

interface DetectedContent {
  content: string;
  type: string;
}

const TextProcessor: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [detectedContent, setDetectedContent] = useState<DetectedContent[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const detectSeparatedContent = (text: string): DetectedContent[] => {
    const results: DetectedContent[] = [];
    
    // Split by lines for processing
    const lines = text.split('\n');
    let currentItem = '';
    let currentType = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        if (currentItem && currentType) {
          results.push({ content: currentItem.trim(), type: currentType });
          currentItem = '';
          currentType = '';
        }
        continue;
      }
      
      // Detect numbered lists (1., 2., etc.)
      const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        if (currentItem && currentType) {
          results.push({ content: currentItem.trim(), type: currentType });
        }
        currentItem = numberedMatch[2];
        currentType = `Numbered Item (${numberedMatch[1]})`;
        continue;
      }
      
      // Detect lettered lists (a., b., etc.)
      const letteredMatch = line.match(/^([a-zA-Z])\.\s+(.*)$/);
      if (letteredMatch) {
        if (currentItem && currentType) {
          results.push({ content: currentItem.trim(), type: currentType });
        }
        currentItem = letteredMatch[2];
        currentType = `Lettered Item (${letteredMatch[1]})`;
        continue;
      }
      
      // Detect bullet points (-, *, •)
      const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
      if (bulletMatch) {
        if (currentItem && currentType) {
          results.push({ content: currentItem.trim(), type: currentType });
        }
        currentItem = bulletMatch[1];
        currentType = 'Bullet Point';
        continue;
      }
      
      // Detect Roman numerals (i., ii., etc.)
      const romanMatch = line.match(/^([ivxlcdm]+)\.\s+(.*)$/i);
      if (romanMatch) {
        if (currentItem && currentType) {
          results.push({ content: currentItem.trim(), type: currentType });
        }
        currentItem = romanMatch[2];
        currentType = `Roman Numeral (${romanMatch[1]})`;
        continue;
      }
      
      // Detect step indicators (Step 1:, Step 2:, etc.)
      const stepMatch = line.match(/^step\s+(\d+):?\s+(.*)$/i);
      if (stepMatch) {
        if (currentItem && currentType) {
          results.push({ content: currentItem.trim(), type: currentType });
        }
        currentItem = stepMatch[2];
        currentType = `Step ${stepMatch[1]}`;
        continue;
      }
      
      // If we have a current item, append this line to it
      if (currentItem) {
        currentItem += '\n' + line;
      }
    }
    
    // Add the last item if it exists
    if (currentItem && currentType) {
      results.push({ content: currentItem.trim(), type: currentType });
    }
    
    return results;
  };

  const handleProcessText = () => {
    if (!rawText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to process",
        variant: "destructive"
      });
      return;
    }
    
    const detected = detectSeparatedContent(rawText);
    setDetectedContent(detected);
    
    toast({
      title: "Text Processed",
      description: `Found ${detected.length} separated items`,
    });
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleRemove = (index: number) => {
    const newContent = detectedContent.filter((_, i) => i !== index);
    setDetectedContent(newContent);
    toast({
      title: "Removed",
      description: "Item removed successfully",
    });
  };

  const handleCopyAndRemove = async (content: string, index: number) => {
    await handleCopy(content);
    handleRemove(index);
  };

  const handleAddText = () => {
    if (rawText.trim()) {
      handleProcessText();
      setShowAddDialog(false);
      setRawText('');
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="win98-panel p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold">Text Content Separator</h2>
          <button
            className="win98-button"
            onClick={() => setShowAddDialog(true)}
          >
            ➕ Add Text
          </button>
        </div>

        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 border-2 border-gray-400 p-4 min-w-96">
              <div className="win98-titlebar mb-2">
                <span>Add Raw Text</span>
                <button
                  className="win98-control-button"
                  onClick={() => setShowAddDialog(false)}
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-xs mb-1">Enter your text:</label>
                <textarea
                  className="win98-input win98-scrollbar"
                  rows={10}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste or type your text here..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="win98-button"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="win98-button"
                  onClick={handleAddText}
                  disabled={!rawText.trim()}
                >
                  Process Text
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="win98-panel-inset p-2 h-5/6 overflow-y-auto win98-scrollbar">
          {detectedContent.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-xs">No separated content detected</div>
              <div className="text-xs mt-1">Click "Add Text" to get started</div>
            </div>
          ) : (
            <div className="space-y-2">
              {detectedContent.map((item, index) => (
                <ContentBox
                  key={index}
                  content={item.content}
                  type={item.type}
                  index={index}
                  onCopy={handleCopy}
                  onRemove={handleRemove}
                  onCopyAndRemove={handleCopyAndRemove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextProcessor;

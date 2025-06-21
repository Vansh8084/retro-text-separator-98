
import React, { useState, useEffect } from 'react';
import ContentBox from './ContentBox';
import { useToast } from '@/hooks/use-toast';

interface DetectedContent {
  content: string;
  type: string;
}

const TextProcessor: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [customSeparator, setCustomSeparator] = useState('');
  const [detectedContent, setDetectedContent] = useState<DetectedContent[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('textSeparatorContent');
    const savedSeparator = localStorage.getItem('textSeparatorCustomSeparator');
    
    if (savedContent) {
      try {
        setDetectedContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }
    
    if (savedSeparator) {
      setCustomSeparator(savedSeparator);
    }
  }, []);

  // Save to localStorage whenever detectedContent changes
  useEffect(() => {
    localStorage.setItem('textSeparatorContent', JSON.stringify(detectedContent));
  }, [detectedContent]);

  // Save custom separator to localStorage
  useEffect(() => {
    localStorage.setItem('textSeparatorCustomSeparator', customSeparator);
  }, [customSeparator]);

  const detectSeparatedContent = (text: string): DetectedContent[] => {
    const results: DetectedContent[] = [];
    
    // First, try to split by <_> separator
    if (text.includes('<_>')) {
      const parts = text.split('<_>').filter(part => part.trim());
      parts.forEach((part, index) => {
        if (part.trim()) {
          results.push({
            content: part.trim(),
            type: `<_> Separated Item ${index + 1}`
          });
        }
      });
      return results;
    }
    
    // Then try custom separator if provided
    if (customSeparator && text.includes(customSeparator)) {
      const parts = text.split(customSeparator).filter(part => part.trim());
      parts.forEach((part, index) => {
        if (part.trim()) {
          results.push({
            content: part.trim(),
            type: `Custom Separated Item ${index + 1}`
          });
        }
      });
      return results;
    }
    
    // Fallback: treat as single content if no separators found
    if (text.trim()) {
      results.push({
        content: text.trim(),
        type: 'Single Content'
      });
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
    const newContent = [...detectedContent, ...detected];
    setDetectedContent(newContent);
    
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

  const handleClearAll = () => {
    setDetectedContent([]);
    localStorage.removeItem('textSeparatorContent');
    toast({
      title: "Cleared",
      description: "All content cleared",
    });
  };

  return (
    <div className="flex-1 p-4">
      <div className="win98-panel p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold">Text Content Separator</h2>
          <div className="flex gap-2">
            <button
              className="win98-button"
              onClick={() => setShowAddDialog(true)}
            >
              ➕ Add Text
            </button>
            {detectedContent.length > 0 && (
              <button
                className="win98-button"
                onClick={handleClearAll}
              >
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {/* Custom Separator Input */}
        <div className="mb-4 win98-panel-inset p-2">
          <label className="block text-xs mb-1">Custom Separator (optional):</label>
          <input
            type="text"
            className="win98-input"
            value={customSeparator}
            onChange={(e) => setCustomSeparator(e.target.value)}
            placeholder="Enter custom separator text..."
          />
          <div className="text-xs mt-1 text-gray-600">
            Default separator: &lt;_&gt; | Current: {customSeparator || '<_>'}
          </div>
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
                  placeholder="Use <_> to separate content or your custom separator..."
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
              <div className="text-xs mt-1">Use &lt;_&gt; or custom separator to split content</div>
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

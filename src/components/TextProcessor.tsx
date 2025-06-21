
import React, { useState, useEffect } from 'react';
import ContentBox from './ContentBox';
import { useToast } from '@/hooks/use-toast';
import { Filter, Plus } from 'lucide-react';

interface DetectedContent {
  content: string;
  type: string;
  id: string;
  timestamp: number;
}

interface TextProcessorProps {
  activeFolder: string;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
}

const TextProcessor: React.FC<TextProcessorProps> = ({
  activeFolder,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  showAddDialog,
  setShowAddDialog
}) => {
  const [rawText, setRawText] = useState('');
  const [customSeparator, setCustomSeparator] = useState('');
  const [detectedContent, setDetectedContent] = useState<DetectedContent[]>([]);
  const [removedContent, setRemovedContent] = useState<DetectedContent[]>([]);
  const [showBulkAddDialog, setShowBulkAddDialog] = useState(false);
  const [bulkAddText, setBulkAddText] = useState('');
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('textSeparatorContent');
    const savedRemovedContent = localStorage.getItem('textSeparatorRemovedContent');
    const savedSeparator = localStorage.getItem('textSeparatorCustomSeparator');
    
    if (savedContent) {
      try {
        setDetectedContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    }

    if (savedRemovedContent) {
      try {
        setRemovedContent(JSON.parse(savedRemovedContent));
      } catch (error) {
        console.error('Error loading removed content:', error);
      }
    }
    
    if (savedSeparator) {
      setCustomSeparator(savedSeparator);
    }
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem('textSeparatorContent', JSON.stringify(detectedContent));
  }, [detectedContent]);

  useEffect(() => {
    localStorage.setItem('textSeparatorRemovedContent', JSON.stringify(removedContent));
  }, [removedContent]);

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
            type: `<_> Separated Item ${index + 1}`,
            id: `${Date.now()}-${index}`,
            timestamp: Date.now()
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
            type: `Custom Separated Item ${index + 1}`,
            id: `${Date.now()}-${index}`,
            timestamp: Date.now()
          });
        }
      });
      return results;
    }
    
    // Fallback: treat as single content if no separators found
    if (text.trim()) {
      results.push({
        content: text.trim(),
        type: 'Single Content',
        id: `${Date.now()}`,
        timestamp: Date.now()
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
    const currentData = activeFolder === 'saved' ? detectedContent : removedContent;
    const itemToRemove = currentData[index];
    
    if (activeFolder === 'saved') {
      const newContent = detectedContent.filter((_, i) => i !== index);
      setDetectedContent(newContent);
      setRemovedContent([...removedContent, itemToRemove]);
    } else {
      const newRemovedContent = removedContent.filter((_, i) => i !== index);
      setRemovedContent(newRemovedContent);
    }
    
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
    if (activeFolder === 'saved') {
      setDetectedContent([]);
      localStorage.removeItem('textSeparatorContent');
    } else {
      setRemovedContent([]);
      localStorage.removeItem('textSeparatorRemovedContent');
    }
    toast({
      title: "Cleared",
      description: "All content cleared",
    });
  };

  const handleRemoveDuplicates = () => {
    const uniqueContent = detectedContent.filter((item, index, self) =>
      index === self.findIndex(t => t.content === item.content)
    );
    setDetectedContent(uniqueContent);
    toast({
      title: "Duplicates Removed",
      description: `Removed ${detectedContent.length - uniqueContent.length} duplicates`,
    });
  };

  const handleBulkAddPrefix = () => {
    if (bulkAddText.trim()) {
      const updatedContent = detectedContent.map(item => ({
        ...item,
        content: `${bulkAddText} ${item.content}`
      }));
      setDetectedContent(updatedContent);
      setBulkAddText('');
      setShowBulkAddDialog(false);
      toast({
        title: "Prefix Added",
        description: "Prefix added to all items",
      });
    }
  };

  const currentData = activeFolder === 'saved' ? detectedContent : removedContent;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  // Reset to page 1 when folder changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFolder, setCurrentPage]);

  return (
    <div className="flex-1 p-4">
      <div className="win98-panel p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold">
            {activeFolder === 'saved' ? 'Saved Content' : 'Removed Items'} 
            ({currentData.length} items)
          </h2>
          <div className="flex gap-2">
            {activeFolder === 'saved' && (
              <>
                <button
                  className="win98-button"
                  onClick={handleRemoveDuplicates}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  Remove Duplicates
                </button>
                <button
                  className="win98-button"
                  onClick={() => setShowBulkAddDialog(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Prefix
                </button>
              </>
            )}
            {currentData.length > 0 && (
              <button
                className="win98-button"
                onClick={handleClearAll}
              >
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {/* Custom Separator Input - only show for saved content */}
        {activeFolder === 'saved' && (
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
        )}

        {/* Pagination Info */}
        {totalPages > 1 && (
          <div className="mb-4 text-xs text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, currentData.length)} of {currentData.length} items 
            (Page {currentPage} of {totalPages})
          </div>
        )}

        {/* Add Text Dialog */}
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

        {/* Bulk Add Prefix Dialog */}
        {showBulkAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 border-2 border-gray-400 p-4 min-w-96">
              <div className="win98-titlebar mb-2">
                <span>Add Prefix to All Items</span>
                <button
                  className="win98-control-button"
                  onClick={() => setShowBulkAddDialog(false)}
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-xs mb-1">Enter prefix text:</label>
                <input
                  type="text"
                  className="win98-input"
                  value={bulkAddText}
                  onChange={(e) => setBulkAddText(e.target.value)}
                  placeholder="Text to add before each item..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="win98-button"
                  onClick={() => setShowBulkAddDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="win98-button"
                  onClick={handleBulkAddPrefix}
                  disabled={!bulkAddText.trim()}
                >
                  Add Prefix
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="win98-panel-inset p-2 h-5/6 overflow-y-auto win98-scrollbar">
          {paginatedData.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <div className="text-2xl mb-2">
                {activeFolder === 'saved' ? '📝' : '🗑️'}
              </div>
              <div className="text-xs">
                {activeFolder === 'saved' 
                  ? 'No separated content detected' 
                  : 'No removed items'
                }
              </div>
              {activeFolder === 'saved' && (
                <>
                  <div className="text-xs mt-1">Click "Add Text" to get started</div>
                  <div className="text-xs mt-1">Use &lt;_&gt; or custom separator to split content</div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {paginatedData.map((item, index) => (
                <ContentBox
                  key={item.id || index}
                  content={item.content}
                  type={item.type}
                  index={startIndex + index}
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

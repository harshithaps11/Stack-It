import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface TagSuggestionsProps {
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  maxTags?: number;
}

const TagSuggestions: React.FC<TagSuggestionsProps> = ({
  selectedTags,
  onAddTag,
  onRemoveTag,
  maxTags = 5
}) => {
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular tags for suggestions
  const popularTags = [
    'javascript', 'react', 'typescript', 'python', 'node.js', 'html', 'css',
    'vue', 'angular', 'php', 'java', 'c#', 'c++', 'go', 'rust', 'swift',
    'kotlin', 'dart', 'flutter', 'react-native', 'next.js', 'express',
    'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'git', 'github', 'gitlab', 'ci/cd',
    'testing', 'jest', 'cypress', 'selenium', 'webpack', 'vite',
    'tailwind', 'bootstrap', 'material-ui', 'antd', 'chakra-ui'
  ];

  const filteredSuggestions = popularTags.filter(
    tag => !selectedTags.includes(tag) && 
    tag.toLowerCase().includes(tagInput.toLowerCase())
  ).slice(0, 8);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < maxTags) {
      onAddTag(trimmedTag);
      setTagInput('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setShowSuggestions(value.length > 0);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    handleAddTag(tag);
  };

  useEffect(() => {
    if (selectedTags.length >= maxTags) {
      setShowSuggestions(false);
    }
  }, [selectedTags, maxTags]);

  return (
    <div className="relative">
      {/* Tag Input */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={tagInput}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onFocus={() => setShowSuggestions(tagInput.length > 0)}
          placeholder={`Add a tag (e.g., javascript, react, python) - ${selectedTags.length}/${maxTags}`}
          className={`flex-1 px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f70776] focus:border-transparent transition-colors ${
            selectedTags.length >= maxTags ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 dark:border-gray-700'
          }`}
          disabled={selectedTags.length >= maxTags}
        />
        <button
          type="button"
          onClick={() => handleAddTag(tagInput)}
          disabled={!tagInput.trim() || selectedTags.length >= maxTags}
          className="px-4 py-2 bg-[#f70776] hover:bg-[#e6066a] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
            >
                              <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="text-[#f70776] hover:text-[#e6066a] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && selectedTags.length < maxTags && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">Popular tags:</div>
            {filteredSuggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSuggestionClick(tag)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex items-center justify-between"
              >
                <span>#{tag}</span>
                <Plus className="w-3 h-3 text-gray-500 dark:text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500 dark:text-gray-500">
        Add tags to help others find and answer your question. Use existing tags when possible.
        {selectedTags.length >= maxTags && (
          <span className="text-yellow-500 dark:text-yellow-400 ml-1">Maximum {maxTags} tags reached.</span>
        )}
      </p>
    </div>
  );
};

export default TagSuggestions; 
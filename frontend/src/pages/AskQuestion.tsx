import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import TagSuggestions from '../components/TagSuggestions';
// 1. We now get both `user` and `token` from our auth context
import { useAuth } from '../contexts/AuthContext';
// 2. We import the real API function we created
import { createQuestion } from '../api/api';

const AskQuestion: React.FC = () => {
  // Get both the user and the token. The token is needed for the API call.
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // This redirect logic is still perfect.
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // These functions are for UI logic and don't need to change.
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // This client-side validation is still a good first-pass check.
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!content.trim() || content === '<p><br></p>') { // Check for empty RichTextEditor
      newErrors.content = 'Description is required';
    } else if (content.length < 30) {
      newErrors.content = 'Description must be at least 30 characters';
    }

    if (tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- THIS IS THE MAIN UPDATED FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Also check if the token exists before submitting.
    if (!validateForm() || !token) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous submission errors

    try {
      // 3. Create the payload object with the form data.
      const payload = { title, content, tags };
      
      // 4. Call the real API function with the payload and the token.
      const response = await createQuestion(payload, token);
      
      // 5. Navigate to the new question's page using the ID from the backend's response.
      navigate(`/questions/${response.question.id}`);

    } catch (error: any) {
      console.error('Error creating question:', error);
      // 6. Display the specific error message from the backend.
      setErrors({ 
        submit: error.message || 'Failed to create question. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // The useEffect will handle the redirect.
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ask a Question</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get help from the community by asking a clear, detailed question.
        </p>
      </div>

      {/* The form JSX remains the same, as it's already wired to the component's state. */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your programming question? Be specific."
            className={`w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f70776] focus:border-transparent transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {title.length}/200 characters
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Provide all the details. What are you trying to achieve? What have you tried? Include any error messages."
            className={errors.content ? 'border-red-500' : ''}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-400">{errors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Include all relevant details. The more context you provide, the better answers you'll receive.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags * (up to 5)
          </label>
          
          <TagSuggestions
            selectedTags={tags}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            maxTags={5}
          />

          {errors.tags && (
            <p className="mt-1 text-sm text-red-400">{errors.tags}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-300">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#f70776] hover:bg-[#e6066a] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Publishing...' : 'Publish Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Search, TrendingUp, MessageSquare, Eye, Filter } from 'lucide-react';
import { fetchTags } from '../api/api';

// This interface matches the NEW, simple backend response
interface RawTagData {
  name: string;
  description: string;
  questions: {
    answer_count: number;
    views: number;
    created_at: string;
  }[];
}

// This component represents a single Tag Card
const TagCard: React.FC<{ tag: RawTagData }> = ({ tag }) => {
  // We use useMemo to calculate stats only when the tag data changes.
  const stats = useMemo(() => {
    const questionCount = tag.questions.length;
    const answerCount = tag.questions.reduce((sum, q) => sum + q.answer_count, 0);
    const viewCount = tag.questions.reduce((sum, q) => sum + q.views, 0);
    const lastUsed = questionCount > 0 
      ? new Date(Math.max(...tag.questions.map(q => new Date(q.created_at).getTime()))).toISOString()
      : null;
    return { questionCount, answerCount, viewCount, lastUsed };
  }, [tag]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-6 flex-grow">
        <Link
          to={`/?tags=${tag.name}`}
          className="inline-block text-lg font-semibold text-gray-900 dark:text-white hover:text-[#f70776] transition-colors mb-2"
        >
          {tag.name}
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {tag.description}
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{stats.questionCount.toLocaleString()} questions</span>
          <span>Last used: {formatDate(stats.lastUsed)}</span>
        </div>
      </div>
    </div>
  );
};

// This is the main page component
const Tags: React.FC = () => {
  const [allTags, setAllTags] = useState<RawTagData[]>([]);
  const [displayTags, setDisplayTags] = useState<RawTagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Effect 1: Fetch data from the API once on component load
  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTags();
        setAllTags(data);
      } catch (err: any) {
        setError(err.message || "Failed to load tags.");
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, []);

  // Effect 2: Filter and sort data whenever user input changes
  useEffect(() => {
    let processedTags = [...allTags];

    if (searchQuery) {
      processedTags = processedTags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    processedTags.sort((a, b) => {
      const aCount = a.questions.length;
      const bCount = b.questions.length;
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Default to popular
      return bCount - aCount;
    });
    
    setDisplayTags(processedTags);
  }, [searchQuery, sortBy, allTags]);

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tags</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          A tag is a keyword that categorizes your question with other, similar questions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 min-w-0 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by tag name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f70776]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f70776]"
            >
              <option value="popular">Popular</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading && (
          // Renders 8 skeleton cards while loading
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))
        )}
        
        {error && <p className="col-span-full text-center text-red-500">{error}</p>}
        
        {!loading && !error && displayTags.map((tag) => (
          <TagCard key={tag.name} tag={tag} />
        ))}
        
        {!loading && !error && displayTags.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tags found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;
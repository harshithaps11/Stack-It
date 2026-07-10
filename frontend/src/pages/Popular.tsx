import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MessageSquare, Eye, Filter, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestions, voteOnQuestion } from '../api/api';

// Updated interface to match the backend (id is a number)
interface Question {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    reputation: number;
  };
  tags: string[];
  voteCount: number;
  answerCount: number;
  views: number;
  createdAt: string;
}

const Popular: React.FC = () => {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('votes');

  useEffect(() => {
    const loadPopularQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchQuestions({ sortBy: filter });
            setQuestions(data);
        } catch (err: any) {
            setError(err.message || 'Could not load popular questions.');
        } finally {
            setLoading(false);
        }
    };
    loadPopularQuestions();
  }, [filter]);

  const handleVote = async (questionId: number, direction: 'up' | 'down') => {
    if (!token) {
        alert('You must be logged in to vote.');
        return;
    }
    try {
        const response = await voteOnQuestion(questionId, direction, token);
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.id === questionId ? { ...q, voteCount: response.newVoteCount } : q
            )
        );
    } catch (err: any) {
        alert(err.message || 'Voting failed.');
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  // --- THE LAYOUT FIX IS HERE ---
  // Removed `mx-auto` to allow the block to align left within its parent container.
  // Kept `max-w-4xl` for readability on wide screens.
  return (
    <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section remains the same */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Questions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Most voted, viewed, and answered questions from the community.
          </p>
        </div>
        
        {user && (
          <Link
            to="/ask"
            className="mt-4 sm:mt-0 bg-[#f70776] hover:bg-[#e6066a] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Ask Question</span>
          </Link>
        )}
      </div>

      {/* Stats section will now work with real data */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : questions.reduce((sum, q) => sum + q.voteCount, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Votes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <MessageSquare className="w-5 h-5" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : questions.reduce((sum, q) => sum + q.answerCount, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Answers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <Eye className="w-5 h-5" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : questions.reduce((sum, q) => sum + q.views, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : questions.length}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
          </div>
        </div>
      </div>

      {/* Filters section remains the same */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'votes', label: 'Most Votes', icon: TrendingUp },
            { key: 'views', label: 'Most Views', icon: Eye },
            { key: 'answers', label: 'Most Answers', icon: MessageSquare },
            { key: 'newest', label: 'Recent', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-full transition-colors ${
                filter === key
                  ? 'bg-[#f70776] text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions List with loading, error, and data states */}
      <div className="space-y-4">
        {loading && (
            [...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                </div>
            ))
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onVote={handleVote}
          />
        ))}
        {!loading && !error && questions.length === 0 && (
            <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No popular questions found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Try changing the filter or ask a new question!
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Popular;
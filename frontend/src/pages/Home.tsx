import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { useAuth } from '../contexts/AuthContext';
import { fetchQuestions, voteOnQuestion } from '../api/api';

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

const Home: React.FC = () => {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(searchParams.get('filter') || 'newest');

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          sortBy: filter === 'unanswered' ? 'newest' : filter,
          filter: filter === 'unanswered' ? 'unanswered' : undefined
        };
        let fetchedQuestions = await fetchQuestions(params.sortBy);
        
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
          fetchedQuestions = fetchedQuestions.filter(q => 
            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.content.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setQuestions(fetchedQuestions);
      } catch (err: any) {
        setError(err.message || 'Could not load questions.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [searchParams, filter]);

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
    const newParams = new URLSearchParams(searchParams);
    if (newFilter === 'unanswered') {
      newParams.set('filter', 'unanswered');
    } else {
      newParams.delete('filter');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const currentSearch = searchParams.get('search');
  const currentTags = searchParams.get('tags');

  // THIS IS THE CORRECT LAYOUT FOR ALL PAGES
  return (
    <div className="w-full max-w-4xl">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentSearch ? `Search Results for "${currentSearch}"` : 
             currentTags ? `Questions tagged "${currentTags}"` : 
             'All Questions'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {loading ? '...' : `${questions.length} question${questions.length !== 1 ? 's' : ''}`}
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

      {/* Filters section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'newest', label: 'Newest' },
            { key: 'votes', label: 'Most Votes' },
            { key: 'answers', label: 'Most Answers' },
            { key: 'unanswered', label: 'Unanswered' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === key
                  ? 'bg-[#f70776] text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading && (
            [...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 animate-pulse">
                     <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                     <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
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
            <Search className="w-12 h-12 text-gray-500 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to ask a question!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
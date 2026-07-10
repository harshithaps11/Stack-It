import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Award, MessageSquare, HelpCircle, TrendingUp, Search, Filter } from 'lucide-react';
import { fetchUsers } from '../api/api';

// 1. Updated interface to match our backend response
interface UserProfile {
  id: number;
  username: string;
  reputation: number;
  questionsAsked: number;
  answersGiven: number;
  acceptedAnswers: number;
  joinedDate: string;
  badges: string[];
  isOnline: boolean;
}

const Users: React.FC = () => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [displayUsers, setDisplayUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('reputation');
  const [filter, setFilter] = useState('all');

  // Effect 1: Fetch data once when the component loads
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUsers();
        setAllUsers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Effect 2: Process (filter and sort) the data whenever inputs change
  useEffect(() => {
    let processedUsers = [...allUsers];

    if (searchQuery) {
      processedUsers = processedUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'online') {
      processedUsers = processedUsers.filter(user => user.isOnline);
    } else if (filter === 'offline') {
      processedUsers = processedUsers.filter(user => !user.isOnline);
    }

    processedUsers.sort((a, b) => {
      switch (sortBy) {
        case 'reputation': return b.reputation - a.reputation;
        case 'questions': return b.questionsAsked - a.questionsAsked;
        case 'answers': return b.answersGiven - a.answersGiven;
        case 'joined': return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case 'username': return a.username.localeCompare(b.username);
        default: return 0;
      }
    });
    
    setDisplayUsers(processedUsers);
  }, [searchQuery, sortBy, filter, allUsers]);

  const getReputationColor = (reputation: number) => {
    if (reputation >= 1000) return 'text-yellow-600 dark:text-yellow-400';
    if (reputation >= 500) return 'text-gray-600 dark:text-gray-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Gold': return 'bg-yellow-500 text-white';
      case 'Silver': return 'bg-gray-400 text-white';
      case 'Bronze': return 'bg-orange-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover and connect with the StackIt community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 min-w-0 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f70776]"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#f70776]"
            >
              <option value="reputation">Reputation</option>
              <option value="joined">New Users</option>
              <option value="username">Username</option>
              <option value="questions">Questions Asked</option>
              <option value="answers">Answers Given</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {error && <p className="col-span-full text-center text-red-500">{error}</p>}
        
        {!loading && !error && displayUsers.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f70776] to-[#e6066a] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    to={`/profile/${user.id}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-[#f70776] transition-colors"
                  >
                    {user.username}
                  </Link>
                  <p className={`font-semibold ${getReputationColor(user.reputation)}`}>
                    {user.reputation.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {formatDate(user.joinedDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                  {user.badges.map((badge, index) => (
                    <span key={index} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getBadgeColor(badge)}`}>
                      {badge}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ))}

        {!loading && !error && displayUsers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
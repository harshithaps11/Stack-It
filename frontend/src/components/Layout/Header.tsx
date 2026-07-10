import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext'; // Import layout context
import NotificationDropdown from '../NotificationDropdown';
import ThemeToggle from '../ThemeToggle';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  // Get the toggle functions for both sidebars
  const { toggleDesktopSidebar, toggleMobileSidebar } = useLayout();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed top-0 w-full z-30">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          {/* Desktop Sidebar Toggle Button */}
          <button onClick={toggleDesktopSidebar} className="hidden lg:block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          {/* Mobile Sidebar Toggle Button */}
          <button onClick={toggleMobileSidebar} className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#f70776] to-[#680747] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="hidden sm:inline-block text-xl font-bold text-gray-900 dark:text-white">StackIt</span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f70776]"
                />
              </div>
            </form>
        </div>

        {/* Right side navigation */}
        <nav className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/ask" className="bg-[#f70776] hover:bg-[#e6066a] text-white px-4 py-2 rounded-lg font-medium">Ask Question</Link>
                <NotificationDropdown />
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to={`/profile/${user.id}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="font-medium">Login</Link>
                <Link to="/register" className="bg-[#f70776] hover:bg-[#e6066a] text-white px-4 py-2 rounded-lg font-medium">Sign Up</Link>
              </div>
            )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
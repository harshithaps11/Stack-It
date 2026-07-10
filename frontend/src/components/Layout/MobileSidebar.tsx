import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, HelpCircle, Tag, Users, X } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';
import { fetchSidebarStats } from '../../api/api';

interface SidebarStats {
  quickStats: {
    questions: number;
    answers: number;
    users: number;
  };
  popularTags: string[];
}

const MobileSidebar: React.FC = () => {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useLayout();
  const location = useLocation();
  const [stats, setStats] = useState<SidebarStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMobileSidebarOpen && !stats) {
      const loadStats = async () => {
        setLoading(true);
        try {
          const data = await fetchSidebarStats();
          setStats(data);
        } catch (error) {
          console.error("Failed to load sidebar stats:", error);
        } finally {
          setLoading(false);
        }
      };
      loadStats();
    }
  }, [isMobileSidebarOpen, stats]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Popular', path: '/popular' },
    { icon: HelpCircle, label: 'Unanswered', path: '/unanswered' },
    { icon: Tag, label: 'Tags', path: '/tags' },
    { icon: Users, label: 'Users', path: '/users' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    toggleMobileSidebar();
  };

  return (
    <>
      <div className={`lg:hidden fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isMobileSidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`} onClick={handleNavClick} />
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg text-gray-800 dark:text-white">Menu</span>
            <button onClick={handleNavClick} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="overflow-y-auto">
            <div className="space-y-1 mb-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive(item.path) ? 'bg-[#f70776] text-white font-medium' : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 px-3">Popular Tags</h3>
              <div className="space-y-1">
                {loading ? <div className="text-sm text-gray-500 px-3">Loading...</div> : stats?.popularTags.map((tag) => (
                  <Link key={tag} to={`/?tags=${tag}`} onClick={handleNavClick} className="block text-sm text-gray-600 dark:text-gray-400 hover:text-[#f70776] px-3 py-1">#{tag}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 px-3">Quick Stats</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 px-3">
                {loading ? <div className="text-sm text-gray-500">Loading...</div> : (
                  <>
                    <div>Questions: {stats?.quickStats.questions.toLocaleString()}</div>
                    <div>Answers: {stats?.quickStats.answers.toLocaleString()}</div>
                    <div>Users: {stats?.quickStats.users.toLocaleString()}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
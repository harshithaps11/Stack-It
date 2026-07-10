
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Tag, Users, TrendingUp, HelpCircle } from 'lucide-react';
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

const Sidebar: React.FC = () => {
  const { isDesktopSidebarOpen } = useLayout();
  const location = useLocation();
  const [stats, setStats] = useState<SidebarStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Popular', path: '/popular' },
    { icon: HelpCircle, label: 'Unanswered', path: '/unanswered' },
    { icon: Tag, label: 'Tags', path: '/tags' },
    { icon: Users, label: 'Users', path: '/users' },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`hidden lg:block bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed top-0 left-0 pt-16 transition-all duration-300 ease-in-out ${
      isDesktopSidebarOpen ? 'w-64' : 'w-0'
    } overflow-hidden`}>
      <nav className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-[#f70776] text-white font-medium shadow-lg'
                  : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 px-3 whitespace-nowrap">
            Popular Tags
          </h3>
          <div className="space-y-2">
            {loading ? <div className="text-sm text-gray-500 px-3">Loading...</div> : stats?.popularTags.map((tag) => (
              <Link
                key={tag}
                to={`/?tags=${tag}`}
                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-[#f70776] transition-colors px-3"
              >
                <span className="whitespace-nowrap">#{tag}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 px-3 whitespace-nowrap">
            Quick Stats
          </h3>
          {/* <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 px-3 whitespace-nowrap">
            {loading ? <div className="text-sm text-gray-500">Loading...</div> : (
              <>
                <div>Questions: {stats?.quickStats.questions.toLocaleString()}</div>
                <div>Answers: {stats?.quickStats.answers.toLocaleString()}</div>
                <div>Users: {stats?.quickStats.users.toLocaleString()}</div>
              </>
            )}
          </div> */}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
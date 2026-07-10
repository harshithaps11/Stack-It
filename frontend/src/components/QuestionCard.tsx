import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, MessageSquare, Eye, Clock, User } from 'lucide-react';

// 1. Updated interface to match the backend (id is a number)
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
  acceptedAnswer?: string;
}

// 2. Updated props to accept an onVote function
interface QuestionCardProps {
  question: Question;
  onVote: (questionId: number, direction: 'up' | 'down') => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onVote }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return ''; // Prevent errors during server-side rendering if ever used
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <div className="flex gap-6">
        {/* 3. UPDATED Stats section to be interactive */}
        <div className="flex flex-col items-center space-y-1 text-sm text-gray-500 dark:text-gray-400 min-w-[60px]">
          <button
            onClick={() => onVote(question.id, 'up')}
            className="group p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Upvote question"
          >
            <ChevronUp className="w-6 h-6 group-hover:text-[#f70776] transition-colors" />
          </button>
          <span className="font-medium text-lg">{question.voteCount}</span>
          <div className={`flex items-center space-x-1 ${question.acceptedAnswer ? 'text-green-400' : ''}`}>
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{question.answerCount}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/questions/${question.id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-[#f70776] transition-colors line-clamp-2"
          >
            {question.title}
          </Link>
          
          <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {stripHtml(question.content)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {question.tags.map((tag) => (
              <Link
                key={tag}
                to={`/?tags=${tag}`}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#f70776]/10 text-[#f70776] dark:bg-[#f70776]/20 dark:text-[#f70776] rounded-full hover:bg-[#f70776]/20 dark:hover:bg-[#f70776]/30 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Author and Date */}
          <div className="flex flex-wrap items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400 gap-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{question.author.username}</span>
              <span className="text-yellow-500 dark:text-yellow-400">({question.author.reputation})</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Clock className="w-4 h-4" />
              <span>asked {formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
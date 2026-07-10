import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, Eye, Home, Check } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../contexts/AuthContext';
// Import the new API functions
import {
  fetchQuestionById,
  fetchAnswersForQuestion,
  voteOnQuestion,
  postAnswer,
  acceptAnswer
} from '../api/api';

// --- INTERFACES TO MATCH FLASK API ---
interface Author {
  id: number;
  username: string;
  reputation: number;
}

interface Question {
  id: number;
  title: string;
  content: string;
  author: Author;
  tags: string[];
  voteCount: number;
  answerCount: number;
  views: number;
  createdAt: string;
}

interface Answer {
  id: number;
  content: string;
  author: Author;
  voteCount: number;
  isAccepted: boolean;
  createdAt: string;
}

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answerContent, setAnswerContent] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // --- DATA FETCHING EFFECT ---
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [questionData, answersData] = await Promise.all([
          fetchQuestionById(id),
          fetchAnswersForQuestion(id),
        ]);
        setQuestion(questionData);
        setAnswers(answersData);
      } catch (err: any) {
        setError(err.message || 'Could not load question data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // --- ACTION HANDLERS ---
  const handleVote = async (itemId: number, direction: 'up' | 'down') => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await voteOnQuestion(itemId, direction, token);
      if (question && question.id === itemId) {
        setQuestion({ ...question, voteCount: response.newVoteCount });
      }
    } catch (err: any) {
      alert(err.message || 'Vote failed');
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id || !answerContent.trim()) return;

    setSubmittingAnswer(true);
    try {
      const newAnswer = await postAnswer(id, answerContent, token);
      setAnswers([...answers, newAnswer]);
      setAnswerContent('');
      if (question) {
        setQuestion({ ...question, answerCount: question.answerCount + 1 });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit answer.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    if (!token || !question) return;

    if (question.author.id !== user?.id) {
        alert("You are not the author of this question.");
        return;
    }

    try {
      await acceptAnswer(answerId, token);
      setAnswers(answers.map(ans => ({
        ...ans,
        isAccepted: ans.id === answerId
      })));
    } catch (err: any) {
      alert(err.message || "Failed to accept answer.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="text-center text-gray-700 dark:text-white p-8">Loading question...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!question) {
    return <div className="text-center text-gray-700 dark:text-white p-8">Question not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-pink-400 transition-colors flex items-center space-x-1">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-white">Question</span>
      </nav>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex gap-6">
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <button onClick={() => handleVote(question.id, 'up')} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 dark:hover:text-green-400">
              <ChevronUp className="w-6 h-6" />
            </button>
            <span className="text-xl font-bold text-gray-800 dark:text-white">{question.voteCount}</span>
            <button onClick={() => handleVote(question.id, 'down')} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400">
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 mt-4">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{question.views}</span>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{question.title}</h1>
            {/* The `prose` class handles light mode typography, `dark:prose-invert` handles dark mode */}
            <div className="prose dark:prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: question.content }} />
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map(tag => (
                <Link key={tag} to={`/?tags=${tag}`} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  {tag}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <span>Asked by {question.author.username} ({question.author.reputation}) on {formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{question.answerCount} Answer{question.answerCount !== 1 ? 's' : ''}</h2>
      <div className="space-y-6 mb-8">
        {answers.map(answer => (
          <div 
            key={answer.id} 
            className={`p-6 rounded-lg ${
              answer.isAccepted 
                ? 'border border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex gap-6">
              <div className="flex flex-col items-center space-y-2 flex-shrink-0 text-gray-800 dark:text-white">
                  <span className="text-xl font-bold">{answer.voteCount}</span>
                  {user && question.author.id === user.id && (
                    <button onClick={() => handleAcceptAnswer(answer.id)} className={`p-2 rounded-full transition-colors mt-2 ${answer.isAccepted ? 'text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400'}`} title="Accept this answer">
                        <Check className="w-6 h-6" />
                    </button>
                  )}
                  {answer.isAccepted && (!user || question.author.id !== user.id) && <Check className="w-6 h-6 text-green-400 mt-2" title="Accepted Answer"/>}
              </div>
              <div className="flex-1">
                <div className="prose dark:prose-invert max-w-none mb-4" dangerouslySetInnerHTML={{ __html: answer.content }} />
                <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <span>Answered by {answer.author.username} ({answer.author.reputation}) on {formatDate(answer.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      {user ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
            <RichTextEditor content={answerContent} onChange={setAnswerContent} placeholder="Write your answer here..." />
            <div className="flex justify-end mt-4">
              <button type="submit" disabled={submittingAnswer || !answerContent.trim()} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors">
                {submittingAnswer ? 'Posting...' : 'Post Your Answer'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p>Please <Link to="/login" className="text-pink-400 font-bold">log in</Link> or <Link to="/register" className="text-pink-400 font-bold">sign up</Link> to post an answer.</p>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
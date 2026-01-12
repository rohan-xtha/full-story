import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated] = useState(localStorage.getItem('access_token') !== null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await api.get(`stories/${id}/`);
        setStory(response.data);
      } catch (err) {
        setError('Failed to fetch story');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        await api.delete(`stories/${id}/`);
        navigate('/');
      } catch (err) {
        setError('Failed to delete story');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 opacity-70" style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="text-center py-32">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6 shadow-lg">
          <span className="text-red-400 text-3xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-semibold text-red-400 mb-3">{error || 'Story not found'}</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">The story you're looking for might have been deleted or doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-8 py-4 bg-gradient(to right, purple-600, pink-600) text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/50 hover:bg-gradient(to right, purple-700, pink-700)"
        >
          <span className="mr-3">←</span>
          Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden transition-all duration-500 hover:shadow-purple-500/20">
      {/* Story Header */}
      <div className="bg-gradient(to right, purple-600/30, pink-600/30) p-8 md:p-16 border-b border-purple-500/30">
        <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{story.title}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-5 py-2 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 backdrop-blur-sm">
                by {story.user}
              </span>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400">
                  {new Date(story.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {story.updated_at !== story.created_at && (
                  <span className="text-purple-400">
                    • Updated {new Date(story.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link
              to={`/edit/${story.id}`}
              className="px-6 py-3 bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-gradient(to right, red-600, pink-600) text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 hover:bg-gradient(to right, red-700, pink-700)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="p-8 md:p-16">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none prose-lg">
            <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line space-y-6">
              {story.content.split('\n').map((paragraph, index) => (
                <p key={index} className="first-letter:text-4xl first-letter:font-bold first-letter:text-purple-400 first-letter:mr-2 first-letter:float-left">
                  {paragraph || <br />}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-8 md:p-16 pt-0">
        <div className="max-w-3xl mx-auto pt-8 border-t border-purple-500/30">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient(to right, purple-600, pink-600) text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/50 hover:bg-gradient(to right, purple-700, pink-700)"
          >
            <span className="mr-3">←</span>
            Back to Stories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;

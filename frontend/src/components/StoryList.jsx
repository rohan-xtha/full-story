import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await api.get('stories/');
        setStories(response.data);
      } catch (err) {
        setError('Failed to fetch stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-28">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 opacity-70" style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-28">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6 shadow-lg">
          <span className="text-red-400 text-3xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-semibold text-red-400 mb-3">{error}</h3>
        <p className="text-gray-400 max-w-md mx-auto">Please try again later or check your connection.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient(to right, purple-300, pink-300, indigo-300)">
        Explore Stories
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {stories.length === 0 ? (
          <div className="col-span-full text-center py-28 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 hover:shadow-purple-500/20 transition-all duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-500/20 rounded-full mb-8 shadow-lg">
              <span className="text-purple-400 text-4xl">📝</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">No stories found</h3>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">Be the first to share your story with the world and inspire others with your imagination!</p>
            <Link
                to="/create"
                className="inline-flex items-center px-8 py-4 bg-gradient(to right, purple-600, pink-600) text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/50 hover:bg-gradient(to right, purple-700, pink-700)"
              >
              <span className="mr-3">✍️</span>
              Create Your First Story
            </Link>
          </div>
        ) : (
          stories.map((story, index) => (
            <div 
              key={story.id} 
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-purple-500/50 hover:-translate-y-3"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient(to right, purple-600/30, pink-600/30) p-6 border-b border-purple-500/30">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white line-clamp-1 group-hover:text-purple-200 transition-colors duration-300">{story.title}</h2>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 backdrop-blur-sm">
                    by {story.user}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-400">
                    {new Date(story.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {story.updated_at !== story.created_at && (
                    <span className="text-purple-400 text-xs">
                      (Updated)
                    </span>
                  )}
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-8 line-clamp-5 leading-relaxed">{story.content}</p>
                <Link
                  to={`/stories/${story.id}`}
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-all duration-300 group"
                >
                  <span>Read More</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoryList;

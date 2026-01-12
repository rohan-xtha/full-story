import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const StoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
  });
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch story data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchStory = async () => {
        try {
          const response = await api.get(`stories/${id}/`);
          setFormData({
            title: response.data.title,
            author: response.data.author,
            content: response.data.content,
          });
        } catch (err) {
          setError('Failed to fetch story for editing');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchStory();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isEditMode) {
        // Update existing story
        await api.put(`stories/${id}/`, formData);
      } else {
        // Create new story
        await api.post('stories/', formData);
      }
      // Redirect to home page after successful submission
      navigate('/');
    } catch (err) {
      setError(isEditMode ? 'Failed to update story' : 'Failed to create story');
      console.error(err);
    } finally {
      setSubmitting(false);
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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient(to right, purple-300, pink-300, indigo-300)">
        {isEditMode ? 'Edit Story' : 'Create New Story'}
      </h1>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 p-8 md:p-12 transition-all duration-500 hover:shadow-purple-500/20">
        {error && (
          <div className="mb-8 p-5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-3">
              Story Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a captivating title..."
              className="w-full px-5 py-4 bg-white/10 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-200 mb-3">
              Author Name
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Your name or pen name"
              className="w-full px-5 py-4 bg-white/10 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-500/50"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-3">
              Story Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              placeholder="Start writing your story... Let your imagination run wild!"
              className="w-full px-5 py-4 bg-white/10 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-vertical transition-all duration-300 hover:border-purple-500/50"
              required
            ></textarea>
          </div>
          <div className="flex flex-wrap justify-end gap-5 pt-4 border-t border-purple-500/30">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-7 py-3.5 bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-500/20 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-10 py-3.5 rounded-xl font-semibold transition-all duration-300 transform ${
                submitting
                  ? 'bg-purple-500/70 cursor-not-allowed shadow-lg'  
                  : 'bg-gradient(to right, purple-600, pink-600) text-white hover:scale-105 shadow-xl hover:shadow-purple-500/50 hover:bg-gradient(to right, purple-700, pink-700)'
              }`}
            >
              {submitting ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                isEditMode ? 'Update Story' : 'Publish Story'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryForm;

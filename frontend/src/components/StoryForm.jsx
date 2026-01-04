import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function StoryForm({ onStoryCreated, onStoryUpdated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Get story ID from URL for editing

  useEffect(() => {
    if (id) {
      // Fetch existing story data for editing
      const fetchStory = async () => {
        try {
          const token = localStorage.getItem('token');
          const config = token ? {
            headers: {
              Authorization: `Token ${token}`,
            },
          } : {};
          const response = await axios.get(`/api/stories/${id}/`, config);
          setTitle(response.data.title);
          setContent(response.data.content);
        } catch (error) {
          setMessage('Failed to fetch story for editing: ' + (error.response?.data?.detail || error.message));
        }
      };
      fetchStory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storyData = { title, content };
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    try {
      if (id) {
        // Update existing story
        await axios.put(`/api/stories/${id}/`, storyData, config);
        setMessage('Story updated successfully!');
        if (onStoryUpdated) onStoryUpdated();
      } else {
        // Create new story
        await axios.post('/api/stories/', storyData, config);
        setMessage('Story created successfully!');
        if (onStoryCreated) onStoryCreated();
      }
      navigate('/stories'); // Redirect to story list after submission
    } catch (error) {
      setMessage('Failed to save story: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Story' : 'Create New Story'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">{id ? 'Update Story' : 'Create Story'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default StoryForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link

function StoryList() {
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState('');

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: {
          Authorization: `Token ${token}`,
        },
      } : {};
      const response = await axios.get('/api/stories/', config);
      setStories(response.data);
    } catch (error) {
      setMessage('Failed to fetch stories: ' + (error.response?.data?.detail || error.message));
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this story?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      await axios.delete(`/api/stories/${id}/`, config);
      setMessage('Story deleted successfully!');
      fetchStories(); // Re-fetch stories after deletion
    } catch (error) {
      setMessage('Failed to delete story: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div>
      <h2>Stories</h2>
      {message && <p>{message}</p>}
      {stories.length === 0 ? (
        <p>No stories available.</p>
      ) : (
        <ul>
          {stories.map((story) => (
            <li key={story.id}>
              <h3>{story.title}</h3>
              <p>{story.content}</p>
              <p>Author: {story.author}</p>
              <p>Created: {new Date(story.created_at).toLocaleDateString()}</p>
              <div>
                <Link to={`/stories/edit/${story.id}`}>Edit</Link>
                <button onClick={() => handleDelete(story.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StoryList;
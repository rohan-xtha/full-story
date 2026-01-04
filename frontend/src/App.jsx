import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import StoryList from './components/StoryList';
import StoryForm from './components/StoryForm'; // Import StoryForm
import './App.css';

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home after logout
    window.location.reload(); // Force a reload to update auth state
  };

  return (
    <div>
      <h2>Home Page</h2>
      {isAuthenticated ? (
        <>
          <p>You are logged in!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please register or log in.</p>
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/stories">Stories</Link>
              </li>
              <li>
                <Link to="/stories/new">Create New Story</Link>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/stories" element={<StoryList />} />
        <Route path="/stories/new" element={<StoryForm />} /> {/* Route for creating new stories */}
        <Route path="/stories/edit/:id" element={<StoryForm />} /> {/* Route for editing stories */}
      </Routes>
    </Router>
  );
}

export default App;
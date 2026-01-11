import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import StoryList from './components/StoryList';
import StoryDetail from './components/StoryDetail';
import StoryForm from './components/StoryForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StoryList />} />
          <Route path="stories/:id" element={<StoryDetail />} />
          <Route path="create" element={<StoryForm />} />
          <Route path="edit/:id" element={<StoryForm />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div style={{ background: darkMode ? "#121212" : "#fff", minHeight: "100vh" }}>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<HomePage darkMode={darkMode} />} />
            <Route path="/create" element={<CreatePostPage darkMode={darkMode} />} />
            <Route path="/posts/:id" element={<PostPage darkMode={darkMode} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

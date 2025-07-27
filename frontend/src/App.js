import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
// ... 필요한 컴포넌트 import

// 인증된 상태에서만 children을 보여주는 예시
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? children : <Navigate to="/auth" replace />;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 인증이 필요한 라우트 */}
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/posts/:id" element={
            <PrivateRoute>
              <PostPage />
            </PrivateRoute>
          } />
          <Route path="/create" element={
            <PrivateRoute>
              <CreatePostPage />
            </PrivateRoute>
          } />
          {/* 인증이 필요 없는 라우트 */}
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../api/postApi';

const HomePage = ({ darkMode }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getPosts(page, 20)
      .then(res => {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#121212' : '#fff',
        color: darkMode ? '#eee' : '#000',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 메뉴바 */}
      <div
        style={{
          backgroundColor: '#236B8E',
          height: '36px',
          width: '100%',
        }}
      ></div>
      {/* 구분선 */}
      <hr style={{ borderTop: '3px solid #444', margin: 0 }} />
      {/* 로그인 박스 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '24px 32px',
        }}
      >
        <div style={{ width: '220px', fontSize: '14px' }}>
          <h4 style={{ marginBottom: '10px' }}>로그인</h4>
          {currentUser ? (
            <div style={{ color: darkMode ? '#ccc' : '#444' }}>
              {currentUser.displayName || currentUser.email} 님
            </div>
          ) : (
            <div style={{ color: darkMode ? '#aaa' : '#888' }}>
              로그인되어 있지 않습니다.
            </div>
          )}
        </div>
      </div>

      {/* 게시글 리스트 */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          marginTop: '20px',
          background: darkMode ? '#23272f' : '#f9f9f9',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: darkMode ? '#5fd3f3' : '#236B8E', margin: 0 }}>게시글 목록</h2>
          <button
            style={{
              padding: '8px 20px',
              backgroundColor: '#236B8E',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/create')}
          >
            글쓰기
          </button>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>불러오는 중...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '14px' }}>
            <thead>
              <tr style={{ background: darkMode ? '#1a1e26' : '#ececec' }}>
                <th style={{ padding: '12px 0', borderBottom: '2px solid #236B8E', width: '60px' }}>번호</th>
                <th style={{ padding: '12px 0', borderBottom: '2px solid #236B8E' }}>제목</th>
                <th style={{ padding: '12px 0', borderBottom: '2px solid #236B8E', width: '180px' }}>작성자</th>
                <th style={{ padding: '12px 0', borderBottom: '2px solid #236B8E', width: '160px' }}>작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '28px 0', color: '#888' }}>
                    게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post, idx) => (
                  <tr
                    key={post.id}
                    style={{
                      cursor: 'pointer',
                      background: idx % 2 === 0 ? (darkMode ? '#222933' : '#fff') : (darkMode ? '#23272f' : '#f8faff')
                    }}
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    <td style={{ textAlign: 'center', padding: '12px 0' }}>
                      {(page - 1) * 20 + idx + 1}
                    </td>
                    <td style={{ padding: '12px 0', color: darkMode ? '#b3e5fc' : '#236B8E', fontWeight: 'bold' }}>
                      {post.title}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 0' }}>{post.authorNickname || post.author}</td>
                    <td style={{ textAlign: 'center', padding: '12px 0' }}>{post.createdAt && post.createdAt.split('T')[0]}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* 페이지네이션 */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              style={{
                margin: '0 4px',
                padding: '6px 12px',
                background: page === i + 1 ? '#236B8E' : (darkMode ? '#222933' : '#fff'),
                color: page === i + 1 ? '#fff' : (darkMode ? '#fff' : '#236B8E'),
                border: `1px solid #236B8E`,
                borderRadius: '5px',
                fontWeight: page === i + 1 ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
              onClick={() => setPage(i + 1)}
              disabled={page === i + 1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

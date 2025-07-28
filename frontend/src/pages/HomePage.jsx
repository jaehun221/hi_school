import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    alert('검색 기능은 아직 구현되지 않았습니다.');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#121212' : '#fff',
        color: darkMode ? '#eee' : '#000',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      {/* 상단: 로고 + 검색창 + 사용자 아이콘 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
        }}
      >
        {/* 로고 */}
        <h1
          style={{ color: '#1976d2', fontSize: '36px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')} // ← 이 줄 추가!
        >
          HiSchool
        </h1>

        {/* 검색창 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '10px 12px',
              fontSize: '16px',
              border: '2px solid #236B8E',
              borderRadius: '4px 0 0 4px',
              width: '320px',
              backgroundColor: darkMode ? '#1e1e1e' : '#fff',
              color: darkMode ? '#fff' : '#000',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 14px',
              backgroundColor: '#236B8E',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '16px',
            }}
          >
            🔍
          </button>
        </div>

        {/* 사용자 메뉴 */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: darkMode ? '#fff' : '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid #ccc',
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
              alt="user icon"
              style={{ width: '24px', height: '24px' }}
            />
          </div>

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                backgroundColor: darkMode ? '#333' : '#fff',
                color: darkMode ? '#eee' : '#000',
                padding: '10px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                width: '160px',
                fontSize: '14px',
              }}
            >
              <label style={{ display: 'block', marginBottom: '8px' }}>
                🌙 다크모드
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  style={{ marginLeft: '5px' }}
                />
              </label>
              <button
                onClick={() => {
                  alert('사용자 설정 페이지는 아직 구현되지 않았습니다.');
                  setMenuOpen(false);
                }}
                style={{
                  marginBottom: '8px',
                  padding: '6px 8px',
                  backgroundColor: '#666',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                사용자 설정
              </button>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '6px 8px',
                    backgroundColor: '#e53935',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  로그아웃
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  style={{
                    padding: '6px 8px',
                    backgroundColor: '#236B8E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  로그인 / 회원가입
                </button>
              )}
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default HomePage;

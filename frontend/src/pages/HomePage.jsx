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
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'} min-h-screen font-sans`}>
      {/* 상단 바 */}
      <div className="flex justify-between items-center px-8 py-4">
        {/* 로고 */}
        <h1
          className="text-4xl font-bold text-blue-700 cursor-pointer"
          onClick={() => navigate('/')}
        >
          HiSchool
        </h1>

        {/* 검색창 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-4 py-2 text-base w-80 rounded-l border-2 ${
              darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-[#236B8E]'
            }`}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#236B8E] text-white rounded-r font-medium hover:bg-[#1e5b78]"
          >
            🔍
          </button>
        </div>

        {/* 사용자 아이콘 */}
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer ${
              darkMode ? 'bg-white border-gray-400' : 'bg-gray-200 border-gray-400'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
              alt="user icon"
              className="w-6 h-6"
            />
          </div>

          {/* 사용자 드롭다운 메뉴 */}
          {menuOpen && (
            <div
              className={`absolute top-12 right-0 rounded-lg shadow-lg w-40 p-3 text-sm z-50 ${
                darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-black'
              }`}
            >
              <label className="block mb-3">
                🌙 다크모드
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="ml-2"
                />
              </label>
              <button
                onClick={() => {
                  alert('사용자 설정 페이지는 아직 구현되지 않았습니다.');
                  setMenuOpen(false);
                }}
                className="w-full mb-2 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                사용자 설정
              </button>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  로그아웃
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-2 bg-[#236B8E] text-white rounded hover:bg-[#1e5b78]"
                >
                  로그인 / 회원가입
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 메뉴 바 */}
      <div className="w-full h-9 bg-[#236B8E]"></div>
      <hr className="border-t-4 border-gray-700 m-0" />

      {/* 로그인 박스 */}
      <div className="flex justify-end px-8 py-6">
        <div className="w-[220px] text-sm">
          <h4 className="mb-2 font-semibold">로그인</h4>
          {currentUser ? (
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentUser.displayName || currentUser.email} 님
            </div>
          ) : (
            <>
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                로그인되어 있지 않습니다.
              </div>
              <button
                onClick={() => navigate('/auth')}
                className="mt-3 w-full py-2 px-3 bg-[#236B8E] text-white rounded font-semibold hover:bg-[#1e5b78]"
              >
                로그인 / 회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

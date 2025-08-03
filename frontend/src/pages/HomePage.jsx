import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
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

  const menuItems = [
    { label: '1', subItems: ['1-1', '1-2'] },
    { label: '2', subItems: ['2-1', '2-2'] },
  ];

  return (
    <div className={`${darkMode ? 'bg-[#2b2b2b] text-gray-100' : 'bg-white text-black'} min-h-screen font-sans`}>
      {/* 상단 바 */}
      <div className="flex justify-between items-center px-8 py-4">
        {/* 로고 */}
        <h1
          className={`text-4xl font-bold cursor-pointer ml-12 ${darkMode ? 'text-white' : 'text-blue-700'}`}
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
              darkMode ? 'bg-[#3a3a3a] text-white border-gray-600' : 'bg-white text-black border-[#236B8E]'
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

          {menuOpen && (
            <div
              className={`absolute top-12 right-0 rounded-lg shadow-lg w-40 p-3 text-sm z-50 ${
                darkMode ? 'bg-[#3a3a3a] text-gray-100' : 'bg-white text-black'
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

      {/* 두꺼운 네비게이션 바 + 숫자 메뉴 */}
      <div className="relative bg-[#236B8E] h-12 z-10">
        <div className="flex items-center h-full space-x-10 px-20">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="relative text-white font-semibold text-lg"
              onMouseEnter={() => setDropdownOpen(idx)}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <button className="hover:underline">{item.label}</button>
              {dropdownOpen === idx && (
                <div className="absolute top-full left-0 mt-1 bg-white text-black shadow-lg rounded-md w-28 py-2 z-50">
                  {item.subItems.map((sub, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => alert(`${item.label} > ${sub}`)}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 구분선 */}
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

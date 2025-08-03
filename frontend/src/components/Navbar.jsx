import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      width: "100%",
      background: darkMode ? "#1a2230" : "#fff",
      color: darkMode ? "#eee" : "#232323",
      boxShadow: "0 2px 8px rgba(60,120,160,0.07)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "15px 36px"
      }}>
        {/* 로고 */}
        <h1
          style={{ color: "#236B8E", fontSize: "32px", fontWeight: "bold", cursor: "pointer", margin: 0 }}
          onClick={() => navigate("/")}
        >
          HiSchool
        </h1>
        {/* 검색창 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            placeholder="검색"
            style={{
              padding: '8px 12px',
              fontSize: '15px',
              border: '1.5px solid #236B8E',
              borderRadius: '4px 0 0 4px',
              width: '220px',
              backgroundColor: darkMode ? '#1e1e1e' : '#fff',
              color: darkMode ? '#fff' : '#000',
            }}
            disabled // 실제 검색 기능 미구현이면
          />
          <button
            style={{
              padding: '8px 13px',
              backgroundColor: '#236B8E',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '15px',
            }}
            disabled
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
              backgroundColor: darkMode ? '#232f38' : '#ececec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1.5px solid #236B8E',
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
                top: '48px',
                right: 0,
                backgroundColor: darkMode ? '#232f38' : '#fff',
                color: darkMode ? '#eee' : '#232323',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
                minWidth: 170,
                fontSize: 15,
                zIndex: 100,
              }}
            >
              <label style={{ display: "block", marginBottom: "10px" }}>
                🌙 다크모드
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  style={{ marginLeft: "7px" }}
                />
              </label>
              <button
                onClick={() => {
                  alert('사용자 설정 페이지는 아직 구현되지 않았습니다.');
                  setMenuOpen(false);
                }}
                style={{
                  marginBottom: "10px",
                  padding: "7px 8px",
                  background: "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >사용자 설정</button>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "7px 8px",
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >로그아웃</button>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  style={{
                    padding: "7px 8px",
                    background: "#236B8E",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >로그인 / 회원가입</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

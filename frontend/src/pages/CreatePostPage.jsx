import React, { useState } from "react";
import { createPost } from "../api/postApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await createPost({
        title,
        content,
        author: currentUser.displayName,
        authorUid: currentUser.uid,
      });
      navigate("/");
    } catch (err) {
      alert("글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#eee" : "#232323",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        transition: "background 0.3s",
      }}
    >
      {/* 상단: 제목 + 다크모드 스위치 */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "32px 0 16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: darkMode ? "#5fd3f3" : "#236B8E", margin: 0 }}>게시글 작성</h2>
        <label style={{ fontSize: 15, cursor: "pointer" }}>
          <span role="img" aria-label="다크모드" style={{ marginRight: 4 }}>
            🌙
          </span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((v) => !v)}
            style={{ marginRight: 2 }}
          />
          다크모드
        </label>
      </div>

      {/* 글쓰기 폼 */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: darkMode ? "#23272f" : "#f9f9f9",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "32px 38px 36px 38px",
        }}
      >
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* 제목 */}
          <div style={{ marginBottom: 22 }}>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={80}
              style={{
                width: "100%",
                fontSize: 22,
                padding: "14px 16px",
                border: `2px solid #236B8E`,
                borderRadius: 7,
                background: darkMode ? "#222933" : "#fff",
                color: darkMode ? "#b3e5fc" : "#236B8E",
                fontWeight: "bold",
                marginBottom: 8,
                outline: "none",
              }}
              autoFocus
            />
          </div>
          {/* 내용 */}
          <div style={{ marginBottom: 30 }}>
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              style={{
                width: "100%",
                fontSize: 17,
                lineHeight: 1.6,
                padding: "16px",
                border: `1.5px solid #236B8E`,
                borderRadius: 7,
                background: darkMode ? "#222933" : "#fff",
                color: darkMode ? "#eee" : "#232323",
                resize: "vertical",
                minHeight: 180,
                outline: "none",
              }}
            />
          </div>

          {/* 작성자/버튼 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                color: darkMode ? "#b3e5fc" : "#236B8E",
                fontWeight: "bold",
                fontSize: 15,
                letterSpacing: 0.1,
              }}
            >
              작성자: {currentUser.displayName || currentUser.email}
            </div>
            <div>
              <button
                type="button"
                style={{
                  background: "#eee",
                  color: "#236B8E",
                  border: "none",
                  borderRadius: 6,
                  padding: "9px 22px",
                  marginRight: 10,
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                style={{
                  background: "#236B8E",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 28px",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1,
                }}
                disabled={loading}
              >
                {loading ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;

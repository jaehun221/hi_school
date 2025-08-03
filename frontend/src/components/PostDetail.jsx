import React from "react";

// post = { title, content, author, authorNickname, createdAt }
const PostDetail = ({ post, darkMode = false }) => {
  return (
    <div
      style={{
        padding: "32px 32px 18px 32px",
        borderRadius: 12,
        background: darkMode ? "#181e24" : "#f8fbff",
        boxShadow: darkMode
          ? "0 2px 10px rgba(20,40,80,0.15)"
          : "0 2px 10px rgba(60,120,160,0.06)",
        marginBottom: 26,
        border: darkMode ? "1.5px solid #232f38" : "1.5px solid #e3eef7",
        transition: "background 0.2s"
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}>
        <h2 style={{
          color: darkMode ? "#5fd3f3" : "#236B8E",
          margin: 0,
          fontWeight: "bold",
          fontSize: 27,
          wordBreak: "break-all"
        }}>
          {post.title}
        </h2>
        {/* 글 번호, 또는 기타 정보 추가 가능 */}
      </div>
      <div style={{
        color: darkMode ? "#aaa" : "#888",
        fontSize: 15,
        marginBottom: 20
      }}>
        <span style={{ marginRight: 18 }}>
          작성자: <b style={{ color: darkMode ? "#b3e5fc" : "#236B8E" }}>{post.authorNickname || post.author}</b>
        </span>
        <span>
          {post.createdAt && post.createdAt.split("T")[0]}
        </span>
      </div>
      <hr style={{
        border: 0,
        height: 1.5,
        background: darkMode ? "#232f38" : "#dde6ee",
        margin: "12px 0 18px 0"
      }} />
      <div style={{
        fontSize: 18,
        lineHeight: 1.85,
        color: darkMode ? "#c3eafc" : "#232323",
        minHeight: 120,
        whiteSpace: "pre-line"
      }}>
        {post.content}
      </div>
    </div>
  );
};

export default PostDetail;

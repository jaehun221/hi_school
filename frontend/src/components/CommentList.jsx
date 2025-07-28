import React from "react";

const CommentList = ({ comments, onEdit, onDelete, darkMode = false, currentUser }) => {
  if (!comments || comments.length === 0) {
    return (
      <div style={{
        color: darkMode ? "#b3e5fc" : "#888",
        padding: "18px 0",
        textAlign: "center"
      }}>
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: darkMode ? "#181e24" : "#f7fafd",
            borderRadius: 7,
            padding: "12px 18px",
            marginBottom: 12,
            fontSize: 16,
            boxShadow: darkMode ? "0 1px 4px rgba(20,40,80,0.08)" : "0 1px 4px rgba(60,120,160,0.04)"
          }}>
          <div>
            {/* 작성자 */}
            <span style={{
              color: darkMode ? "#8ec6ff" : "#236B8E",
              fontWeight: "bold",
              marginRight: 10
            }}>
              {comment.authorNickname || comment.author || "익명"}
            </span>
            <span style={{ color: darkMode ? "#b3e5fc" : "#999", fontSize: 14 }}>
              {comment.createdAt && comment.createdAt.split("T")[0]}
            </span>
            <div style={{ color: darkMode ? "#c3eafc" : "#222", marginTop: 2, whiteSpace: "pre-line" }}>
              {comment.content}
            </div>
          </div>
          {/* 작성자(본인)만 버튼 보임 */}
          {currentUser && comment.authorUid === currentUser.uid && (
            <div style={{ display: "flex", gap: 7, marginLeft: 18 }}>
              <button
                onClick={() => onEdit(comment)}
                style={{
                  background: darkMode ? "#2e3a4a" : "#e2f0ff",
                  color: darkMode ? "#b3e5fc" : "#236B8E",
                  border: "none",
                  borderRadius: 5,
                  padding: "4px 13px",
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginRight: 2,
                  transition: "background 0.2s"
                }}
              >수정</button>
              <button
                onClick={() => onDelete(comment.id)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: 5,
                  padding: "4px 13px",
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >삭제</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;

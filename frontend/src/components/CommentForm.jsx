import React, { useState } from "react";

const CommentForm = ({ onSubmit, initialValue, darkMode = false, onCancel }) => {
  const [content, setContent] = useState(initialValue?.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ content });
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="댓글을 입력하세요."
        rows={3}
        style={{
          resize: "vertical",
          padding: "13px 14px",
          fontSize: 16,
          border: `1.5px solid #236B8E`,
          borderRadius: 7,
          background: darkMode ? "#181e24" : "#fff",
          color: darkMode ? "#c3eafc" : "#222",
          outline: "none",
          transition: "background 0.2s"
        }}
        maxLength={300}
      />
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
      }}>
        {onCancel &&
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: darkMode ? "#262e3a" : "#ececec",
              color: darkMode ? "#aaa" : "#236B8E",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 15,
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >취소</button>
        }
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#236B8E",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "9px 22px",
            fontWeight: "bold",
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            minWidth: 70
          }}
        >
          {loading ? "등록 중..." : initialValue ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;

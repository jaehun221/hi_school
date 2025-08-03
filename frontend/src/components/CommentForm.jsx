import React, { useState } from "react";

const CommentForm = ({ onSubmit, initialValue, darkMode = false, onCancel, parentId }) => {
  const [content, setContent] = useState(initialValue?.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        content,
        parentId,
        author: initialValue?.author,
        authorUid: initialValue?.authorUid,
        authorNickname: initialValue?.authorNickname
      });
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      position: "relative" // 글자수 표시용
    }}>
      <div style={{ position: "relative" }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="댓글을 입력하세요."
          rows={3}
          style={{
            width: "100%",
            minWidth: "280px",
            maxWidth: "100%",
            height: "100px",
            minHeight: "100px",
            maxHeight: "100px",
            resize: "none",
            overflow: "auto",
            padding: "13px 14px",
            fontSize: 16,
            border: `1.5px solid #236B8E`,
            borderRadius: 7,
            background: darkMode ? "#181e24" : "#fff",
            color: darkMode ? "#c3eafc" : "#222",
            outline: "none",
            transition: "background 0.2s"
          }}
          maxLength={200}
        />
        <span
          style={{
            position: "absolute",
            right: 16,
            bottom: 10,
            fontSize: 13,
            color: darkMode ? "#6a8ca0" : "#b0b0b0",
            opacity: 0.7,
            pointerEvents: "none"
          }}
        >
          {content.length} / 200
        </span>
      </div>
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

/*
- 댓글/대댓글 입력 지원 (parentId)
- 200자 제한, 글자수 표시
- 입력창 크기 고정, 스크롤
- 등록/수정/취소 버튼
- darkMode 지원
*/

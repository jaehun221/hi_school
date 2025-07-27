import React, { useState } from "react";

const CommentForm = ({ onSubmit, initialValue }) => {
  const [author, setAuthor] = useState(initialValue?.author || "");
  const [content, setContent] = useState(initialValue?.content || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ author, content });
        setAuthor("");
        setContent("");
      }}
    >
      <input
        placeholder="작성자"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        placeholder="댓글"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">댓글 등록</button>
    </form>
  );
};

export default CommentForm;
